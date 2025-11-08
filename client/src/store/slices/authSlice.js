// client/src/store/slices/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

// 1. Check if user info is already in localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// 2. Define the initial state
const initialState = {
  userInfo: userInfoFromStorage, // Load user info from storage
};

// 3. Create the slice
const authSlice = createSlice({
  name: 'auth', // The name of our slice
  initialState,
  // 4. Reducers are the functions that update the state
  reducers: {
    // This action is called when the user successfully logs in
    setCredentials(state, action) {
      state.userInfo = action.payload; // Update the state with user data
      // Save the user data to localStorage
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // This action is called when the user logs out
    logout(state) {
      state.userInfo = null; // Clear the user data from state
      localStorage.removeItem('userInfo'); // Clear it from localStorage
    },
  },
});

// 5. Export the actions so we can use them in our components
export const { setCredentials, logout } = authSlice.actions;

// 6. Export the reducer to be added to the store
export default authSlice.reducer;