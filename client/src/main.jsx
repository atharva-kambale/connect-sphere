// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store/store.js';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// --- 1. Import axios ---
import axios from 'axios';

// Import Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- 2. THIS IS THE NEW CODE ---
// This tells axios what our base URL is.
// In production (on Vercel), it will use the VITE_API_URL we set.
// In development (local), our vite.config.js proxy is still used.
if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}
// --- End of New Code ---

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      // Private (Protected)
      {
        path: '',
        element: <ProtectedRoute />,
        children: [{ path: '/create-listing', element: <CreateListingPage /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);