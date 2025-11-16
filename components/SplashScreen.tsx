
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fadeIn">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 1.5s ease-in-out;
          }
        `}
      </style>
      <div className="text-center p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 tracking-wide">
          SARADA NURSERY SCHOOL
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 mt-4">গণিত পরীক্ষা</p>
      </div>
    </div>
  );
};

export default SplashScreen;
