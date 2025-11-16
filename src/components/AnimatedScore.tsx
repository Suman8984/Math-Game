import React, { useState, useEffect } from 'react';

interface AnimatedScoreProps {
    score: number;
    className?: string;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({ score, className }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = score;
        if (start === end) {
            setDisplayScore(end);
            return;
        };

        const duration = Math.min(2000, Math.abs(end - start) * 30);
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentScore = Math.floor(progress * (end - start) + start);
            
            setDisplayScore(currentScore);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayScore(end); // Ensure it ends on the exact score
            }
        };

        requestAnimationFrame(animate);

    }, [score]);

    return <span className={className}>{displayScore}</span>;
};

export default AnimatedScore;
