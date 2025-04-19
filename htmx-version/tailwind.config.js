/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'gradient': 'gradient-shift 3s ease infinite',
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
      transitionProperty: {
        'width': 'width',
      }
    },
  },
  plugins: [],
} 