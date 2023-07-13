/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        'dark-purple': '#03001E',
        purple: '#9F4DD2',
        'light-white': '#FDEFF9',
        'theme-color': '#df00fe',
      },
    },
  },
  plugins: [],
};
