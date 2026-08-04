/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C81E2C',
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
          700: '#C81E2C',
          800: '#A61D25',
        },
        brand: {
          red: '#C81E2C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

