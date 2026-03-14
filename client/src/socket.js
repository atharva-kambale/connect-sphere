// client/src/socket.js

import { io } from 'socket.io-client';
import { store } from './store/store.js'; // We need to import the Redux store

const URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000';

const socket = io(URL, {
  // --- THIS IS THE FIX ---
  autoConnect: false, // We will connect manually in the Navbar
  
  // This 'auth' function runs *every time* the socket tries to connect
  auth: (cb) => {
    // Get the current state from Redux
    const state = store.getState();
    const token = state.auth.userInfo?.token;
    
    // Send the token to the server
    cb({
      token: token,
    });
  },
  // --- END OF FIX ---
});

export default socket;