// client/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 1. Import the path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 2. Add the resolve block to help Vite find paths correctly
  resolve: {
    alias: {
      // This is a common fix to prevent path issues in build process
      '@': path.resolve(__dirname, './src'), 
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});