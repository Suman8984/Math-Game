import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Operator, GameQuestion } from '../types';
import AnimatedScore from './AnimatedScore';
import { startAudioContext, playCorrectSound, playWinSound, playClickSound } from '../utils/audio';


interface MathGameProps {
    onNavigate: (view: View) => void;
}

const TOTAL_GAME_QUESTIONS = 50;
const PROBLEM_INTERVAL = 2000; // ms

const generateGameQuestion = (id: number): Omit<GameQuestion, 'y' | 'x' | 'speed'> => {
    let num1: number, num2: number, operator: Operator, answer: number;
    const opType = Math.floor(Math.random() * 4);

    switch (opType) {
        case 0: // +
            operator = '+';
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            break;
        case 1: // -
            operator = '-';
            num1 = Math.floor(Math.random() * 50) + 20;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            answer = num1 - num2;
            break;
        case 2: // ×
            operator = '×';
            num1 = Math.floor(Math.random() * 10) + 2;
            num2 = Math.floor(Math.random() * 10) + 2;
            answer = num1 * num2;
            break;
        case 3: // ÷
        default:
            operator = '÷';
            const divisor = Math.floor(Math.random() * 9) + 2;
            const quotient = Math.floor(Math.random() * 10) + 2;
            num1 = divisor * quotient;
            num2 = divisor;
            answer = quotient;
            break;
    }
    return { id, num1, num2, operator, answer };
};


const MathGame: React.FC<MathGameProps> = ({ onNavigate }) => {
    const [activeProblems, setActiveProblems] = useState<GameQuestion[]>([]);
    const [score, setScore] = useState(0);
    const [questionsLeft, setQuestionsLeft] = useState(TOTAL_GAME_QUESTIONS);
    const [inputValue, setInputValue] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const nextQuestionId = useRef(0);

    const addProblem = useCallback(() => {
        if (nextQuestionId.current >= TOTAL_GAME_QUESTIONS) return;

        const q = generateGameQuestion(nextQuestionId.current);
        nextQuestionId.current++;

        const gameAreaWidth = gameAreaRef.current?.offsetWidth || window.innerWidth;
        const newProblem: GameQuestion = {
            ...q,
            y: -60,
            x: Math.random() * (gameAreaWidth - 150), // 150 is approx problem width
            speed: Math.random() * 1 + 0.5,
        };
        
        setQuestionsLeft(prev => prev - 1);
        setActiveProblems(prev => [...prev, newProblem]);
    }, []);
    
    const endGame = useCallback(() => {
        if (!isGameOver) {
            setIsGameOver(true);
            playWinSound();
        }
    }, [isGameOver]);

    useEffect(() => {
        if (!isStarted || isGameOver) return;
        
        const spawner = setInterval(addProblem, PROBLEM_INTERVAL);
        return () => clearInterval(spawner);
    }, [isStarted, isGameOver, addProblem]);

    useEffect(() => {
        if (!isStarted || isGameOver) return;

        const gameLoop = setInterval(() => {
            const gameAreaHeight = gameAreaRef.current?.offsetHeight || window.innerHeight;
            let missedProblem = false;
            setActiveProblems(prev =>
                prev.map(p => ({ ...p, y: p.y + p.speed })).filter(p => {
                    if (p.y > gameAreaHeight) {
                        missedProblem = true;
                        return false;
                    }
                    return true;
                })
            );

            if (missedProblem && activeProblems.length === 0 && questionsLeft <= 0) {
                 endGame();
            }

        }, 16); // ~60fps

        return () => clearInterval(gameLoop);
    }, [activeProblems, isStarted, isGameOver, questionsLeft, endGame]);

     useEffect(() => {
        if(isStarted && questionsLeft <=0 && activeProblems.length === 0 && !isGameOver) {
            endGame();
        }
    }, [questionsLeft, activeProblems, isGameOver, isStarted, endGame]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) { // only allow numbers
            setInputValue(val);
            const numVal = parseInt(val, 10);
            if (!isNaN(numVal)) {
                const newProblems = [...activeProblems];
                const foundIndex = newProblems.findIndex(p => p.answer === numVal);
                if (foundIndex !== -1) {
                    newProblems.splice(foundIndex, 1);
                    setActiveProblems(newProblems);
                    setScore(prev => prev + 1);
                    setInputValue('');
                    playCorrectSound();
                }
            }
        }
    };

    const handleStartGame = () => {
        startAudioContext();
        playClickSound();
        setIsStarted(true);
    };

    if (!isStarted) {
         return (
             <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-gray-200/50 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-purple-600">গণিত খেলা</h1>
                    <p className="text-lg text-gray-600 max-w-md mb-8">ওপর থেকে প্রশ্ন পড়বে। সঠিক উত্তর টাইপ করে সেগুলোকে সমাধান করো।</p>
                    <button
                        onClick={handleStartGame}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-xl text-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
                    >
                        শুরু করো
                    </button>
                </div>
             </div>
         );
    }


    if (isGameOver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center w-full max-w-md border border-gray-200/50">
                    <h2 className="text-3xl font-bold text-purple-700">গেম শেষ!</h2>
                    <p className="text-xl text-gray-600 mt-4">তোমার স্কোর</p>
                    <p className="text-6xl font-extrabold text-green-500 my-4">
                        <AnimatedScore score={score} />
                    </p>
                    <p className="text-lg text-gray-500">{TOTAL_GAME_QUESTIONS} টির মধ্যে {score} টি সঠিক</p>
                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={() => onNavigate('math_game')}
                             className="font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                             আবার খেলো
                        </button>
                        <button
                            onClick={() => onNavigate('menu')}
                             className="font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gray-500 hover:bg-gray-600 text-white"
                        >
                            মেনুতে ফিরে যাও
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="bg-white/70 backdrop-blur-sm shadow-md p-3 flex justify-between items-center z-10 border-b border-gray-200/50">
                <div>
                    <h1 className="text-2xl font-bold text-purple-700">গণিত খেলা</h1>
                    <p className="text-sm text-gray-500 font-medium">SARADA NURSERY SCHOOL</p>
                </div>
                <div className="flex space-x-6 text-lg font-semibold">
                    <p className="text-gray-700">স্কোর: <span className="font-bold text-green-600">{score}</span></p>
                    <p className="text-gray-700">প্রশ্ন বাকি: <span className="font-bold text-red-600">{questionsLeft + activeProblems.length}</span></p>
                </div>
            </header>
            <main ref={gameAreaRef} className="flex-1 relative overflow-hidden math-game-bg">
                {activeProblems.map(p => (
                    <div
                        key={p.id}
                        className="absolute bg-gradient-to-br from-white to-gray-100 px-5 py-3 rounded-lg text-2xl font-mono transition-transform duration-100 ease-linear border-b-4 border-gray-300 text-gray-800 shadow-lg"
                        style={{ 
                            left: `${p.x}px`, 
                            top: `${p.y}px`,
                            transform: `rotate(${p.id % 2 === 0 ? 4 : -4}deg) scale(1)`,
                            transformOrigin: 'center center',
                        }}
                    >
                        {p.num1} {p.operator} {p.num2}
                    </div>
                ))}
            </main>
            <footer className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-200/50 z-10">
                <input
                    type="tel"
                    value={inputValue}
                    onChange={handleInputChange}
                    autoFocus
                    placeholder="তোমার উত্তর লেখো..."
                    className="w-full p-4 text-3xl text-center font-mono rounded-lg border-2 border-gray-300 bg-white shadow-inner focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                />
            </footer>
        </div>
    );
};

export default MathGame;