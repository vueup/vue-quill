module.exports = {
  corePlugins: {
    preflight: false,
  },
  purge: [
    './content/**/*.{vue,js,ts,md}',
    './components/**/*.{vue,js,ts,md}'
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
