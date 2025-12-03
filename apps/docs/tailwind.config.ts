import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: [
    './content/**/*.{vue,js,ts,md}',
    './content/.vitepress/**/*.{vue,js,ts,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [forms],
} satisfies Config
