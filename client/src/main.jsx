// client/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { ThemeProvider } from './context/ThemeContext.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import axios from 'axios';

// Import Pages
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'; // <-- NEW IMPORT
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

// Configure Axios for Production
if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // --- Public Routes ---
      {
        path: '/', 
        element: <LandingPage />,
      },
      {
        path: '/market',
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
        path: '/forgot-password', // <-- NEW ROUTE
        element: <ForgotPasswordPage />,
      },
      {
        path: '/listing/:id',
        element: <ListingDetailPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      { 
        path: '/profile/:userId',
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