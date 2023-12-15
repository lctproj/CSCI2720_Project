/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        blue: {
          500: "#2031CF",
        },
        darkBlue: {
          500: "#293EFF",
        },
        gray: {
          300: "#D9D9D9",
        },
      },
    },
  },
  plugins: [],
}

