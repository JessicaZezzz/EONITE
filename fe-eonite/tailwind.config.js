/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'media',
  plugins: [
    require('@tailwindcss/forms')
  ],
  theme: {
    extend: {
      textColor: ['active'],
    },
  }
}
