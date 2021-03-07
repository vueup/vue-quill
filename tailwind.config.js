module.exports = {
  purge: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './docs/**/*.{vue,js,ts,jsx,tsx,md}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
    },
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
  ],
}
