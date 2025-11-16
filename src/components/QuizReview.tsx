import React from 'react';
import { QuizResult, Question } from '../types';

interface QuizReviewProps {
    results: QuizResult[];
    onBackToResults: () => void;
}

const formatQuestion = (q: Question): string => {
    if (q.num3 !== undefined && q.operator2) {
        return `${q.num1} ${q.operator} ${q.num2} ${q.operator2} ${q.num3}`;
    }
    return `${q.num1} ${q.operator} ${q.num2}`;
};

const QuizReview: React.FC<QuizReviewProps> = ({ results, onBackToResults }) => {
    return (
        <div className="container mx-auto p-4 sm:p-6">
            <header className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 text-center border border-gray-200/50">
                <h1 className="text-3xl font-bold text-indigo-700">ভুল উত্তরগুলো দেখে নাও</h1>
                <p className="text-gray-600 mt-1">এই প্রশ্নগুলোর উত্তর তুমি ভুল দিয়েছ।</p>
            </header>

            <div className="space-y-4">
                {results.map((result) => (
                    <div key={result.question.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                            <p className="text-xl font-mono font-bold text-gray-700 mb-2 sm:mb-0">{formatQuestion(result.question)}</p>
                            <div className="text-left sm:text-right ml-0 sm:ml-4 flex-shrink-0">
                                <p className="text-md text-red-500">তোমার উত্তর: <span className="font-bold">{result.userAnswer}</span></p>
                                <p className="text-md text-green-600">সঠিক উত্তর: <span className="font-bold">{result.question.answer}</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <footer className="mt-8 text-center pb-8">
                 <button
                    onClick={onBackToResults}
                    className="font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gray-500 hover:bg-gray-600 text-white"
                >
                    স্কোরবোর্ডে ফিরে যাও
                </button>
            </footer>
        </div>
    );
};

export default QuizReview;