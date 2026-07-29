/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js",
    "./public/**/*.css"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'Segoe UI', 'system-ui', 'sans-serif'],
        hindi: ['Yatra One', 'cursive'],
      },
      colors: {
        'pastel-blue': '#e0f2fe',
        'pastel-purple': '#faf5ff',
        'pastel-pink': '#fdf2f8',
        'pastel-green': '#f0fdf4',
        'pastel-yellow': '#fef9c3',
        'pastel-orange': '#fff7ed',

        'kid-primary': '#4f46e5',
        'kid-purple': '#9333ea',
        'kid-yellow': '#f59e0b',
        'kid-pink': '#ec4899',
        'kid-green': '#10b981',
        'kid-orange': '#f97316',
      },
      keyframes: {
        'magical-gradient': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'drift-cloud': {
          '0%': { transform: 'translateX(-250px)' },
          '100%': { transform: 'translateX(105vw)' },
        },
        'star-twinkle': {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.7) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.15) rotate(180deg)' },
        },
        'fly-butterfly-1': {
          '0%': { transform: 'translate(-100px, 60vh) scale(0.8) rotate(15deg)' },
          '30%': { transform: 'translate(30vw, 35vh) scale(0.9) rotate(-10deg)' },
          '60%': { transform: 'translate(60vw, 55vh) scale(0.8) rotate(20deg)' },
          '85%': { transform: 'translate(85vw, 25vh) scale(1) rotate(-5deg)' },
          '100%': { transform: 'translate(105vw, 10vh) scale(0.8) rotate(15deg)' },
        },
        'fly-butterfly-2': {
          '0%': { transform: 'translate(-100px, 20vh) scale(0.6) rotate(-10deg)' },
          '40%': { transform: 'translate(40vw, 45vh) scale(0.7) rotate(25deg)' },
          '75%': { transform: 'translate(75vw, 15vh) scale(0.6) rotate(-15deg)' },
          '100%': { transform: 'translate(105vw, 35vh) scale(0.7) rotate(10deg)' },
        },
        'wing-flap': {
          '0%, 100%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(0.25)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        'float-up-down': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
        },
      },
      animation: {
        'magical-gradient': 'magical-gradient 18s ease-in-out infinite',
        'drift-cloud-1': 'drift-cloud 50s linear infinite',
        'drift-cloud-2': 'drift-cloud 75s linear infinite',
        'star-twinkle': 'star-twinkle 4s ease-in-out infinite',
        'fly-butterfly-1': 'fly-butterfly-1 25s linear infinite',
        'fly-butterfly-2': 'fly-butterfly-2 32s linear infinite',
        'wing-flap': 'wing-flap 0.22s linear infinite',
        'bounce-slow': 'bounce-slow 4s ease-in-out infinite',
        'float-slow': 'float-up-down 6s ease-in-out infinite',
        'float-medium': 'float-up-down 5s ease-in-out infinite',
        'float-fast': 'float-up-down 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
