/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff8ff',
          100: '#dcedff',
          200: '#b2dbff',
          300: '#7bc4ff',
          400: '#3da8ff',
          500: '#008efb',
          600: '#0078e5',
          700: '#0062cc',
          800: '#004fa6',
          900: '#003d80',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}