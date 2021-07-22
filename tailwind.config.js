const colors = require('tailwindcss/colors');

module.exports = {
  important: true,
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: { cyan: colors.cyan },
    },
    fontFamily: {
      poppins: ['"Poppins"'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
