// client/main.jsx

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
import axios from 'axios';

// Import Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ListingDetailPage from './pages/ListingDetailPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import EditListingPage from './pages/EditListingPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import InboxPage from './pages/InboxPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AboutPage from './pages/AboutPage.jsx'; // NEW
import ContactPage from './pages/ContactPage.jsx'; // NEW

// Import Components
import ProtectedRoute from './components/ProtectedRoute.jsx';

if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // --- Public Routes ---
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/listing/:id', element: <ListingDetailPage /> },
      { path: '/about', element: <AboutPage /> }, // NEW PUBLIC ROUTE
      { path: '/contact', element: <ContactPage /> }, // NEW PUBLIC ROUTE

      // --- Private / Protected Routes ---
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          { path: '/create-listing', element: <CreateListingPage /> },
          { path: '/edit-listing/:id', element: <EditListingPage /> },
          { path: '/chat/:listingId/:buyerId/:sellerId', element: <ChatPage /> },
          { path: '/inbox', element: <InboxPage /> },
          { path: '/profile', element: <ProfilePage /> },
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