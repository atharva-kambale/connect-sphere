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

// Import Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx'; // 1. Import the new page

// Import Components
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 2. Import the bouncer

// 3. Define our routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The main layout wraps all pages
    children: [
      // --- Public Routes ---
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },

      // --- Private / Protected Routes ---
      {
        path: '', // This acts as a wrapper
        element: <ProtectedRoute />, // The bouncer component
        children: [
          // All routes inside here are now protected
          {
            path: '/create-listing',
            element: <CreateListingPage />,
          },
          // You could add more protected routes here, e.g.,
          // { path: '/my-profile', element: <ProfilePage /> },
          // { path: '/my-listings', element: <MyListingsPage /> },
        ],
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