// client/src/socket.js

import { io } from 'socket.io-client';

// This is the URL of our backend server
const URL = 'http://localhost:5000';

// Create the socket instance
// We set 'autoConnect' to false so we can
// connect manually when we want to.
const socket = io(URL, {
  autoConnect: false,
});

export default socket;