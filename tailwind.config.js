/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        acclaim: {
          blue: '#0066CC',
          dark: '#1a1a2e',
          darker: '#0f0f1a',
          gray: '#2d2d44',
          light: '#e8e8e8',
          accent: '#00a8ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
