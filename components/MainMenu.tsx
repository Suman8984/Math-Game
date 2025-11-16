import React from 'react';
import { View } from '../types';

interface MainMenuProps {
    onNavigate: (view: View) => void;
}

const MenuButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className = '' }) => (
    <button
        onClick={onClick}
        className={`w-full max-w-xs text-xl font-bold text-white py-4 px-6 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-105 ${className}`}
    >
        {children}
    </button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <header className="text-center mb-10">
                <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700">গণিত পরীক্ষা</h1>
                <p className="text-lg text-gray-600 mt-2">তোমার বিভাগ নির্বাচন করো</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <MenuButton onClick={() => onNavigate('std1')} className="bg-gray-400 hover:bg-gray-500">STD I</MenuButton>
                <MenuButton onClick={() => onNavigate('std2')} className="bg-green-500 hover:bg-green-600">STD II</MenuButton>
                <MenuButton onClick={() => onNavigate('std3')} className="bg-gray-400 hover:bg-gray-500">STD III</MenuButton>
                {/* FIX: Corrected a typo in the closing tag of the MenuButton. */}
                <MenuButton onClick={() => onNavigate('std4')} className="bg-blue-500 hover:bg-blue-600">STD IV</MenuButton>
                <div className="md:col-span-2 flex justify-center">
                    <MenuButton onClick={() => onNavigate('math_game')} className="bg-purple-600 hover:bg-purple-700">MATH GAME</MenuButton>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;