/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        learning: {
          fragile: '#f59e0b',
          stable: '#3b82f6',
          mastered: '#10b981',
          leech: '#ef4444',
        },
        ui: {
          correct: '#22c55e',
          wrong: '#ef4444',
          surface: '#ffffff',
          dark: '#1e293b'
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}