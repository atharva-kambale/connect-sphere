// client/src/components/ProfileDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import { useTheme } from '../context/ThemeContext.jsx'; // 1. Import the useTheme hook

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // 2. Get the theme state and toggle function
  const { theme, toggleTheme } = useTheme();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close dropdown when a link is clicked
  };

  if (!userInfo) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. The Clickable Avatar */}
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <img
          src={userInfo.profilePictureUrl}
          alt={userInfo.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-all"
        />
      </button>

      {/* 2. The Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-down
                     dark:bg-gray-800 dark:border-gray-700" // 3. Add dark mode styles
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-white">{userInfo.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userInfo.email}</p>
          </div>
          
          {/* Links */}
          <div className="py-2">
            <Link 
              to={`/profile/${userInfo._id}`} 
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              My Profile
            </Link>
            <Link 
              to="/inbox" 
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Inbox
            </Link>
            <Link 
              to="/settings" 
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Account Settings
            </Link>
          </div>
          
          {/* --- 4. NEW DARK MODE TOGGLE --- */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-2">
            <div 
              className="flex justify-between items-center px-2 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <label htmlFor="theme-toggle" className="text-sm font-medium">Dark Mode</label>
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className="sr-only">Toggle Dark Mode</span>
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          {/* --- END OF NEW TOGGLE --- */}

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={logoutHandler}
              className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 dark:hover:text-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;