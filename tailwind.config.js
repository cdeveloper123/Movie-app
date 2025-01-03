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
