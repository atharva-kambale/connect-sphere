// client/src/socket.js

import { io } from 'socket.io-client';

// --- THIS IS THE FIX ---
// 1. Get the production URL from Vercel's environment variables
//    This is the *same* variable we use for axios
const URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000'; // Fallback to localhost for development

console.log(`Socket connecting to: ${URL}`); // A good log for debugging
// --- END OF FIX ---

// Create the socket instance
const socket = io(URL, {
  autoConnect: false, // We still connect manually in the Navbar
});

export default socket;