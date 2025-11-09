// client/components/Navbar.jsx

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import socket from '../socket.js';

// --- (Styles - createButtonStyle is removed) ---
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  background: '#fff',
  color: '#333',
  borderBottom: '1px solid #ddd',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};
const logoStyle = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '1.5rem',
  fontWeight: 'bold',
};
const navLinksStyle = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
};
const navLinkStyle = {
  textDecoration: 'none',
  color: '#555',
  fontSize: '1rem',
  cursor: 'pointer',
};
// --- (End of styles) ---

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        Connect Sphere
      </Link>

      <div style={navLinksStyle}>
        {userInfo ? (
          // --- If user is logged IN ---
          <>
            <Link to="/inbox" style={navLinkStyle}>
              Inbox
            </Link>
            <Link to="/profile" style={navLinkStyle}>
              Profile
            </Link>
            {/* 1. --- "CREATE LISTING" BUTTON IS REMOVED --- */}
            <span style={{ ...navLinkStyle, color: '#000', cursor: 'default' }}>
              Welcome, {userInfo.name.split(' ')[0]}!
            </span>
            <a onClick={logoutHandler} style={navLinkStyle}>
              Logout
            </a>
          </>
        ) : (
          // --- If user is logged OUT ---
          <>
            <Link to="/login" style={navLinkStyle}>
              Login
            </Link>
            <Link to="/register" style={navLinkStyle}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;