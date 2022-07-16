module.exports = {
  content: [
    './content/**/*.{vue,js,ts,md}',
    './content/.vitepress/**/*.{vue,js,ts,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
