
import React, { useState, useEffect } from 'react';
import { View } from './types';
import MainMenu from './components/MainMenu';
import Placeholder from './components/Placeholder';
import Quiz from './components/Quiz';
import MathGame from './components/MathGame';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
    const [view, setView] = useState<View>('splash');
    const [gameKey, setGameKey] = useState(0);

    useEffect(() => {
        if (view === 'splash') {
            const timer = setTimeout(() => {
                setView('menu');
            }, 3000); // Show splash for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [view]);

    const navigateTo = (newView: View) => {
        // Reset component state by changing the key
        setGameKey(prevKey => prevKey + 1);
        setView(newView);
    };

    const renderView = () => {
        switch (view) {
            case 'splash':
                return <SplashScreen />;
            case 'menu':
                return <MainMenu onNavigate={navigateTo} />;
            case 'std1':
                return <Placeholder title="STD I" onNavigate={navigateTo} />;
            case 'std2':
                return <Quiz key={gameKey} mode="std2" onNavigate={navigateTo} />;
            case 'std3':
                return <Placeholder title="STD III" onNavigate={navigateTo} />;
            case 'std4':
                return <Quiz key={gameKey} mode="std4" onNavigate={navigateTo} />;
            case 'math_game':
                return <MathGame key={gameKey} onNavigate={navigateTo} />;
            default:
                return <MainMenu onNavigate={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-800 antialiased">
            {renderView()}
        </div>
    );
};

export default App;
