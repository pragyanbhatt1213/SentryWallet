/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00B49F',
        'primary-light': '#E8FFF5',
        'primary-dark': '#00A48B',
        accent: '#0A1A16',
        'accent-light': '#1B2E29',
        background: '#E8FFF5',
        teal: {
          50: '#E8FFF5',
          100: '#C2F3E0',
          200: '#A5F0D8',
          300: '#8CE0C0',
          400: '#6BCFB0',
          500: '#00B49F',
          600: '#00A48B',
          700: '#008B7A',
          800: '#006B5F',
          900: '#0A1A16',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};