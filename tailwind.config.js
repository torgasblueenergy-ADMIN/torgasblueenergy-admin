/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palet Konservasi Indonesia — samakan dengan CSS variable di index.css
        torgas: {
          blue: '#0096d7',
          'blue-hover': '#007bb5',
          dark: '#041b2e',
          orange: '#FFAD26',
          'orange-hover': '#e69500'
        }
      },
      fontFamily: { sans: ['Manrope', 'sans-serif'] }
    }
  },
  plugins: []
};
