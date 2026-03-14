// client/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import socket from '../socket.js';
import ProfileDropdown from './ProfileDropdown.jsx';
import axios from 'axios';

// --- Bell Icon Component ---
// Added colorClass prop so the Navbar can tell it to be white on the home page!
const NotificationBell = ({ hasNotification, onClick, colorClass }) => {
  return (
    <button onClick={onClick} className={`relative ${colorClass} transition-colors`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
      {hasNotification > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800">
          {hasNotification > 9 ? '9+' : hasNotification}
        </span>
      )}
    </button>
  );
};

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isTop, setIsTop] = useState(true);
  const isLandingPage = location.pathname === '/';
  
  const [notificationCount, setNotificationCount] = useState(0);

  // Transparent navbar logic
  useEffect(() => {
    if (isLandingPage) {
      const handleScroll = () => setIsTop(window.scrollY < 50);
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsTop(false);
    }
  }, [isLandingPage, location.pathname]);

  // Socket and Notification Logic
  useEffect(() => {
    if (userInfo) {
      socket.connect();
      
      function onNotification(notificationData) {
        setNotificationCount(prevCount => prevCount + 1);
      }
      
      const fetchMissedNotifications = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('/api/notifications', config);
          if (data && data.length > 0) {
            const unreadCount = data.filter(n => !n.isRead).length;
            setNotificationCount(unreadCount);
          }
        } catch (err) { console.error('Failed to fetch notifications', err); }
      };
      
      socket.on('new_message_notification', onNotification);
      fetchMissedNotifications();

      return () => {
        socket.off('new_message_notification', onNotification);
        socket.disconnect();
      };
    } else {
      socket.disconnect();
    }
  }, [userInfo]);
  
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleInboxClick = async () => {
    setNotificationCount(0);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('/api/notifications/mark-read', {}, config);
    } catch (err) { console.error('Failed to mark notifications as read', err); }
    navigate('/inbox');
  };

  // --- Dynamic Class Definitions ---
  const navBaseClass = "fixed top-0 left-0 right-0 z-50 transition-all duration-300";
  const navSolidClass = "bg-white text-gray-800 shadow-md dark:bg-gray-800 dark:border-b dark:border-gray-700";
  const navTransparentClass = "bg-transparent text-white";
  const linkBaseClass = "font-medium transition-colors";
  
  const linkSolidClass = "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white";
  const linkTransparentClass = "text-white hover:text-gray-200";
  
  const navClasses = isLandingPage && isTop ? `${navBaseClass} ${navTransparentClass}` : `${navBaseClass} ${navSolidClass}`;
  const linkClasses = isLandingPage && isTop ? `${linkBaseClass} ${linkTransparentClass}` : `${linkBaseClass} ${linkSolidClass}`;
  const logoClass = isLandingPage && isTop ? "text-white" : "text-gray-800 dark:text-white";
  
  // Dynamic class specifically for the Bell Icon!
  const bellColorClass = isLandingPage && isTop 
    ? "text-white hover:text-gray-200" 
    : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white";

  const loginButtonClass = isLandingPage && isTop
    ? "font-medium border border-white text-white px-3 py-1.5 rounded-md text-sm hover:bg-white hover:text-gray-800 transition-colors"
    : "font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white";
  const signupButtonClass = isLandingPage && isTop
    ? "bg-white text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
    : "bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors";

  return (
    <header className={navClasses}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold ${logoClass} hover:opacity-80 transition-colors`}>
          Connect Sphere
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/market" className={linkClasses}>Marketplace</Link>
          <Link to="/about" className={linkClasses}>About</Link>
          <Link to="/contact" className={linkClasses}>Contact</Link>
          
          {userInfo ? (
            <>
              <button onClick={handleInboxClick} className={linkClasses}>
                Inbox
              </button>
              
              <NotificationBell 
                hasNotification={notificationCount} 
                onClick={handleInboxClick}
                colorClass={bellColorClass} // Passing the color down!
              />
              
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/login" className={loginButtonClass}>Login</Link>
              <Link to="/register" className={signupButtonClass}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;