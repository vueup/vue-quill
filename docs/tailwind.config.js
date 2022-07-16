/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './content/**/*.{vue,js,ts,md}',
    './components/**/*.{vue,js,ts,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
