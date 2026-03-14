// client/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { ThemeProvider } from './context/ThemeContext.jsx'; // Make sure this is imported

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import axios from 'axios';

// Import Pages
import LandingPage from './pages/LandingPage.jsx'; // The new homepage
import HomePage from './pages/HomePage.jsx'; // The marketplace
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ListingDetailPage from './pages/ListingDetailPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import EditListingPage from './pages/EditListingPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import InboxPage from './pages/InboxPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import PublicProfilePage from './pages/PublicProfilePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

// Import Components
import ProtectedRoute from './components/ProtectedRoute.jsx';

if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

// This is the correct router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // --- Public Routes ---
      {
        path: '/', // The root path is now the Landing Page
        element: <LandingPage />,
      },
      {
        path: '/market', // The marketplace is now at /market
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
      {
        path: '/listing/:id',
        element: <ListingDetailPage />,
      },
      {
        path: '/about', // This route was missing
        element: <AboutPage />,
      },
      {
        path: '/contact', // This route was missing
        element: <ContactPage />,
      },
      { 
        path: '/profile/:userId', // The public profile
        element: <PublicProfilePage /> 
      },

      // --- Private / Protected Routes ---
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          { path: '/create-listing', element: <CreateListingPage /> },
          { path: '/edit-listing/:id', element: <EditListingPage /> },
          { path: '/chat/:listingId/:buyerId/:sellerId', element: <ChatPage /> },
          { path: '/inbox', element: <InboxPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);