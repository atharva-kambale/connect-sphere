// client/src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
// 1. Import the reducer from your authSlice
import authReducer from './slices/authSlice'; 

export const store = configureStore({
  reducer: {
    // 2. Add the reducer to the store
    // Any component can now access 'state.auth'
    auth: authReducer,
  },
  devTools: true,
});