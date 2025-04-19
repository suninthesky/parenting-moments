/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2s infinite',
      }
    },
  },
  plugins: [],
} 