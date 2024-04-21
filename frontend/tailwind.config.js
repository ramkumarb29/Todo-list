/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pastelPink: '#FBEAEB',
        Blue: '#2F3C7E'
      },
    },
  },
  plugins: [],
}

