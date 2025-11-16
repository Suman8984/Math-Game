// Create a single AudioContext to be reused.
let audioCtx: AudioContext | null = null;

const initializeAudio = () => {
    if (!audioCtx) {
        // Fallback for older browsers
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
             audioCtx = new AudioContext();
        }
    }
};

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // Volume
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
};

// This function should be called after a user interaction, like a click.
export const startAudioContext = () => {
    initializeAudio();
    if (audioCtx?.state === 'suspended') {
        audioCtx.resume();
    }
};

export const playCorrectSound = () => {
    if (!audioCtx || audioCtx.state !== 'running') return;
    playTone(600, 0.1, 'triangle');
    setTimeout(() => playTone(800, 0.1, 'triangle'), 100);
};

export const playWinSound = () => {
     if (!audioCtx || audioCtx.state !== 'running') return;
     playTone(523.25, 0.15, 'sine'); // C5
     setTimeout(() => playTone(659.25, 0.15, 'sine'), 150); // E5
     setTimeout(() => playTone(783.99, 0.15, 'sine'), 300); // G5
     setTimeout(() => playTone(1046.50, 0.2, 'sine'), 450); // C6
};

export const playClickSound = () => {
    if (!audioCtx || audioCtx.state !== 'running') return;
    playTone(800, 0.05, 'triangle');
};
