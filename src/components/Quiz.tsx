import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, QuizMode, Question, Operator, QuizResult } from '../types';
import QuizReview from './QuizReview';
import AnimatedScore from './AnimatedScore';
import { playWinSound } from '../utils/audio';

interface QuizProps {
    mode: QuizMode;
    onNavigate: (view: View) => void;
}

const TOTAL_QUESTIONS = 50;
const TIME_LIMIT = 10 * 60; // 10 minutes in seconds

const generateNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (min > max) {
        return min; // Return min if range is invalid
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateQuestions = (mode: QuizMode): Question[] => {
    const questions: Question[] = [];
    if (mode === 'std2') {
         for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            let num1: number, num2: number, operator: Operator, answer: number;
            const isAddition = Math.random() > 0.5;
            if (isAddition) {
                operator = '+';
                num1 = generateNumber(1, 99);
                num2 = generateNumber(1, 99);
                answer = num1 + num2;
            } else {
                operator = '-';
                num1 = generateNumber(10, 99);
                num2 = generateNumber(1, num1);
                answer = num1 - num2;
            }
            questions.push({ id: i, num1, num2, operator, answer });
        }
    } else { // std4
        // Section A: First 30 questions, multi-step
        for (let i = 0; i < 30; i++) {
            const op1 = Math.random() > 0.5 ? '+' : '-';
            const op2 = Math.random() > 0.5 ? '+' : '-';
            let num1: number, num2: number, num3: number, intermediateResult: number, answer: number;

            num1 = generateNumber(20, 900);
    
            if (op1 === '+') {
                num2 = generateNumber(20, 999 - num1);
                intermediateResult = num1 + num2;
            } else { // op1 is '-'
                num2 = generateNumber(20, num1 > 20 ? num1 - 1 : 20);
                intermediateResult = num1 - num2;
            }

            if (op2 === '+') {
                num3 = generateNumber(10, 99);
                answer = intermediateResult + num3;
            } else { // op2 is '-'
                if (intermediateResult > 10) { 
                     num3 = generateNumber(10, Math.min(99, intermediateResult - 1));
                } else {
                     num3 = generateNumber(1, 9);
                }
                answer = intermediateResult - num3;
            }

            questions.push({
                id: i,
                num1,
                num2,
                num3,
                operator: op1,
                operator2: op2,
                intermediateAnswer: intermediateResult,
                answer
            });
        }

        // Section B: Last 20 questions, Multiplication
        for (let i = 30; i < TOTAL_QUESTIONS; i++) {
            const num1 = generateNumber(10, 99);
            const num2 = generateNumber(2, 9);
            const answer = num1 * num2;
            questions.push({
                id: i,
                num1,
                num2,
                operator: '×',
                answer
            });
        }
    }
    return questions;
};

const Quiz: React.FC<QuizProps> = ({ mode, onNavigate }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [finalAnswers, setFinalAnswers] = useState<string[]>(Array(TOTAL_QUESTIONS).fill(''));
    const [intermediateAnswers, setIntermediateAnswers] = useState<string[]>(Array(30).fill(''));
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [quizState, setQuizState] = useState<'running' | 'results' | 'review'>('running');
    const [score, setScore] = useState(0);
    const [results, setResults] = useState<QuizResult[]>([]);
    const timerRef = useRef<number | null>(null);

    const finishQuiz = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        let currentScore = 0;
        const quizResults: QuizResult[] = questions.map((q, index) => {
            const userAnswer = finalAnswers[index];
            const isCorrect = parseInt(userAnswer, 10) === q.answer;
            if (isCorrect) {
                currentScore += 2;
            }
            return {
                question: q,
                userAnswer: userAnswer || 'খালি', // Empty answer
                isCorrect,
            };
        });
        
        setScore(currentScore);
        setResults(quizResults);
        playWinSound();
        setQuizState('results');
    }, [finalAnswers, questions]);

    useEffect(() => {
        setQuestions(generateQuestions(mode));
    }, [mode]);
    
    useEffect(() => {
        if (quizState !== 'running') return;

        timerRef.current = window.setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    finishQuiz();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [quizState, finishQuiz]);

    const handleFinalAnswerChange = (index: number, value: string) => {
        const newAnswers = [...finalAnswers];
        newAnswers[index] = value.replace(/[^0-9-]/g, '');
        setFinalAnswers(newAnswers);
    };
    
    const handleIntermediateAnswerChange = (index: number, value: string) => {
        const newAnswers = [...intermediateAnswers];
        newAnswers[index] = value.replace(/[^0-9-]/g, '');
        setIntermediateAnswers(newAnswers);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (quizState === 'review') {
        return <QuizReview 
            results={results.filter(r => !r.isCorrect)}
            onBackToResults={() => setQuizState('results')}
        />
    }

    if (quizState === 'results') {
        const incorrectCount = results.filter(r => !r.isCorrect).length;
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center w-full max-w-lg border border-gray-200/50">
                    <h2 className="text-3xl font-bold text-indigo-700">পরীক্ষা শেষ!</h2>
                    <p className="text-xl text-gray-600 mt-4">তোমার স্কোর</p>
                    <p className="text-6xl font-extrabold text-green-500 my-4">
                        <AnimatedScore score={score} /> / 100
                    </p>
                    {incorrectCount > 0 && (
                        <p className="text-lg text-red-500 mb-6">
                            তোমার {incorrectCount} টি উত্তর ভুল হয়েছে।
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                        {incorrectCount > 0 && (
                            <button
                                onClick={() => setQuizState('review')}
                                className="font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                                ভুল উত্তরগুলো দেখো
                            </button>
                        )}
                        <button
                            onClick={() => onNavigate(mode)}
                            className="font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            আবার চেষ্টা করো
                        </button>
                        <button
                            onClick={() => onNavigate('menu')}
                            className="font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gray-500 hover:bg-gray-600 text-white"
                        >
                            মেনুতে ফিরে যাও
                        </button>
                    </div>
                     {incorrectCount === 0 && (
                        <p className="text-lg text-green-600 mt-6 font-semibold animate-pulse">
                            দারুণ! তুমি সব প্রশ্নের সঠিক উত্তর দিয়েছ!
                        </p>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 sm:p-6">
            <header className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 sticky top-4 z-10 flex flex-col sm:flex-row justify-between items-center border border-gray-200/50">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">STD {mode === 'std2' ? 'II' : 'IV'} - Question Paper</h1>
                    <p className="text-sm text-gray-500 font-medium">SARADA NURSERY SCHOOL</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <div className="text-lg font-semibold text-gray-700">পূর্ণমান: <span className="text-blue-600 font-bold">100</span></div>
                    <div className="text-lg font-bold text-red-500 bg-red-100 px-4 py-2 rounded-full">সময়: {formatTime(timeLeft)}</div>
                </div>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-3 rounded-xl shadow-md flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/50 hover:border-indigo-400/50">
                        <p className="font-bold text-gray-500 text-sm mb-2">Sum {index + 1}</p>
                        
                        {q.num3 !== undefined && q.operator2 && q.intermediateAnswer !== undefined ? (
                            <div className="flex flex-col h-full">
                                <div className="text-right text-xl font-mono space-y-1 text-gray-800">
                                    <div>{q.num1}</div>
                                    <div>{q.operator} {q.num2}</div>
                                </div>
                                <hr className="my-1 border-t-2 border-gray-300"/>
                                <input
                                    type="tel"
                                    value={intermediateAnswers[index]}
                                    onChange={(e) => handleIntermediateAnswerChange(index, e.target.value)}
                                    className="w-full text-right font-mono bg-gray-50 text-gray-800 rounded p-1 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-xl"
                                />
                                <div className="text-right text-xl font-mono mt-1 text-gray-800">
                                    <div>{q.operator2} {q.num3}</div>
                                </div>
                                <hr className="my-1 border-t-2 border-gray-300"/>
                                <input
                                    type="tel"
                                    value={finalAnswers[index]}
                                    onChange={(e) => handleFinalAnswerChange(index, e.target.value)}
                                    className="w-full text-right font-mono bg-gray-100 text-gray-900 rounded p-1 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-xl font-bold"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col h-full justify-between">
                                 <div className="text-right text-2xl font-mono space-y-1 text-gray-800">
                                    <div>{q.num1}</div>
                                    <div>{q.operator} {q.num2}</div>
                                 </div>
                                <hr className="my-2 border-t-2 border-gray-300"/>
                                <input
                                    type="tel"
                                    value={finalAnswers[index]}
                                    onChange={(e) => handleFinalAnswerChange(index, e.target.value)}
                                    className="w-full text-right font-mono bg-gray-100 text-gray-900 rounded p-1 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-2xl font-bold"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <footer className="mt-8 text-center pb-8">
                 <button
                    onClick={finishQuiz}
                    className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                    জমা দাও
                </button>
            </footer>
        </div>
    );
};

export default Quiz;