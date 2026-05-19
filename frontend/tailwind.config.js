// Tailwind configuration - updated to trigger CSS cache rebuild
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kisan-green': {
          DEFAULT: '#166534',
          light: '#22c55e',
          dark: '#14532d',
        },
        'kisan-brown': {
          DEFAULT: '#78350f',
          light: '#b45309',
        },
        'kisan-beige': '#fef3c7',
        'kisan-accent': '#84cc16'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
