import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slideInUp {
            animation: slideInUp 1s ease-out forwards;
          }
          .animate-fadeIn-delay {
            animation: fadeIn 1s ease-in-out 0.5s forwards;
            opacity: 0;
          }
        `}
      </style>
      <div className="text-center p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 tracking-wide animate-slideInUp">
          SARADA NURSERY SCHOOL
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 mt-4 animate-fadeIn-delay">
          গণিত পরীক্ষা
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;