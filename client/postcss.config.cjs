// client/postcss.config.cjs
module.exports = {
  plugins: {
    // Point it to the new .cjs config file
    tailwindcss: { config: './tailwind.config.cjs' },
    autoprefixer: {},
  },
};