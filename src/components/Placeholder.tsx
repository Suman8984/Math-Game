import React from 'react';
import { View } from '../types';

interface PlaceholderProps {
    title: string;
    onNavigate: (view: View) => void;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-gray-200/50">
                <h1 className="text-4xl font-bold text-gray-700">{title}</h1>
                <p className="text-2xl text-gray-500 mt-4">শীঘ্রই আসছে...</p>
                <p className="text-lg text-gray-500">(Coming Soon...)</p>
                <button
                    onClick={() => onNavigate('menu')}
                    className="mt-8 bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300"
                >
                    মেনুতে ফিরে যাও
                </button>
            </div>
        </div>
    );
};

export default Placeholder;