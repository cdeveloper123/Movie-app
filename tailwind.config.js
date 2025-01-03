/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["CursiveFont", "cursive"],
      },
      animation: {
        spin: "spin 1s linear infinite", 
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
    screens: {
      sm: "640px",
      md: "770px",
      lg: "1150px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
