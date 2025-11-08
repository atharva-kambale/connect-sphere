// client/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 1. Add this 'server' section
  server: {
    proxy: {
      // 2. All requests starting with '/api'
      //    will be proxied to 'http://localhost:5000'
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // If your backend is not HTTPS
      },
    },
  },
});