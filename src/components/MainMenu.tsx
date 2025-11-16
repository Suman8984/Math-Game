import React from 'react';
import { View } from '../types';
import { startAudioContext, playClickSound } from '../utils/audio';

interface MainMenuProps {
    onNavigate: (view: View) => void;
}

const MenuButton: React.FC<{ 
    onClick: () => void; 
    children: React.ReactNode; 
    className?: string; 
    icon?: React.ReactNode; 
    disabled?: boolean;
}> = ({ onClick, children, className = '', icon, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full max-w-sm text-xl font-bold text-white py-5 px-6 rounded-2xl shadow-lg transform transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500/50
            disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-inner disabled:text-gray-500
            hover:enabled:shadow-xl hover:enabled:-translate-y-1.5 
            ${className}`}
        >
            <div className="flex items-center justify-center gap-4">
                {icon}
                <span>{children}</span>
            </div>
        </button>
    );
}

const GradeIcon: React.FC<{grade: string;}> = ({ grade }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-black text-indigo-700 bg-white/30 shadow-md`}>
        {grade}
    </div>
);


const GameIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
    const handleNavigation = (view: View) => {
        startAudioContext(); // Initialize or resume audio on first user action
        playClickSound();
        onNavigate(view);
    };

    const buttons = [
        { view: 'std1', label: 'STD I', icon: <GradeIcon grade="I"/>, disabled: true, className: 'bg-gray-400' },
        { view: 'std2', label: 'STD II', icon: <GradeIcon grade="II"/>, disabled: false, className: 'bg-gradient-to-r from-green-500 to-teal-500 transition-shadow duration-300 hover:shadow-glow-green' },
        { view: 'std3', label: 'STD III', icon: <GradeIcon grade="III"/>, disabled: true, className: 'bg-gray-400' },
        { view: 'std4', label: 'STD IV', icon: <GradeIcon grade="IV"/>, disabled: false, className: 'bg-gradient-to-r from-blue-500 to-indigo-500 transition-shadow duration-300 hover:shadow-glow-blue' },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <header className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 drop-shadow-lg">গণিত পরীক্ষা</h1>
                <p className="text-lg text-gray-600 mt-2">তোমার ক্লাস বেছে নাও</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {buttons.map((btn) => (
                     <div key={btn.view}>
                        <MenuButton 
                            onClick={() => handleNavigation(btn.view as View)} 
                            icon={btn.icon} 
                            disabled={btn.disabled}
                            className={btn.className}
                        >
                            {btn.label}
                        </MenuButton>
                    </div>
                ))}
                <div className="md:col-span-2 flex justify-center">
                    <MenuButton 
                        onClick={() => handleNavigation('math_game')} 
                        icon={<GameIcon />} 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 transition-shadow duration-300 hover:shadow-glow-purple"
                    >
                        MATH GAME
                    </MenuButton>
                </div>
            </div>
             <footer className="absolute bottom-4 text-gray-500 text-sm">
                SARADA NURSERY SCHOOL
            </footer>
        </div>
    );
};

export default MainMenu;