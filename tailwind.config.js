/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        acclaim: {
          navy: '#03233F',
          midnight: '#01152A',
          ocean: '#0B3A59',
          slate: '#102543',
          fog: '#E5EAF1',
          mist: '#F7F9FC',
          cloud: '#C7D2E3',
          steel: '#6C7F94',
          accent: '#E6463D',
          coral: '#F26C5F',
          teal: '#2F8C9F',
        }
      },
      fontFamily: {
        sans: ['"Suisse Intl"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
