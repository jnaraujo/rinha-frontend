const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", fontFamily.sans],
      },
      
      colors: {
        invalid: "#BF0E0E",
        accent: "#4E9590",
        brackets: "#F2CAB8",
        gray: "#BFBFBF"
      }
    },
  },
  plugins: [],
};
