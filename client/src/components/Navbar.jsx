// client/components/Navbar.jsx

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import socket from '../socket.js';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Socket logic remains the same
  useEffect(() => {
    if (userInfo) {
      socket.connect();
    } else {
      socket.disconnect();
    }
    return () => {
      socket.disconnect();
    };
  }, [userInfo]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">
          Connect Sphere
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Public Links: Always visible */}
          <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
            Contact
          </Link>
          
          {userInfo ? (
            // --- If user is logged IN (Private Links) ---
            <>
              <Link to="/inbox" className="text-gray-600 hover:text-blue-600 transition-colors">
                Inbox
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                Profile
              </Link>
              
              <span className="text-gray-800">
                Welcome, {userInfo.name.split(' ')[0]}!
              </span>
              
              <button
                onClick={logoutHandler}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // --- If user is logged OUT (Auth Links) ---
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;