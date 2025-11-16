/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'glow-green': '0 0 20px 0px rgba(74, 222, 128, 0.7)',
        'glow-blue': '0 0 20px 0px rgba(96, 165, 250, 0.7)',
        'glow-purple': '0 0 20px 0px rgba(192, 132, 252, 0.7)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out',
      },
    },
  },
  plugins: [],
}