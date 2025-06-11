/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",     // for Next.js pages
      "./components/**/*.{js,ts,jsx,tsx}", // for custom components
      "./app/**/*.{js,ts,jsx,tsx}",        // if you're using the /app directory (Next.js 13+)
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }