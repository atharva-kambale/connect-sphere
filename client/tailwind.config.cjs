// client/tailwind.config.cjs

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // --- 1. ADD THIS NEW KEYFRAME ---
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out' // 2. ADD THIS NEW ANIMATION
      },
      // --- 3. ADD ANIMATION DELAYS ---
      animationDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      }
    },
  },
  // 4. ADD THE DELAY PLUGIN
  plugins: [
    require('tailwindcss-animation-delay') 
  ],
}