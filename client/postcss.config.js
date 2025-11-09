// client/postcss.config.js
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// We export the configuration object directly
export default {
  plugins: [
    // We use the full tailwindcss import here
    tailwindcss(),
    autoprefixer,
  ],
};