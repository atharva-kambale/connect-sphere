// client/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';

// --- (Styles) ---
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
  gap: '1.5rem', // Increased gap
  alignItems: 'center', // Center items vertically
};
const navLinkStyle = {
  textDecoration: 'none',
  color: '#555',
  fontSize: '1rem',
  cursor: 'pointer',
};
const createButtonStyle = {
  ...navLinkStyle,
  background: '#007bff',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
};
// --- (End of styles) ---

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        {/* 1. Show 'Create' link if user is logged in */}
        {userInfo && (
          <Link to="/create-listing" style={createButtonStyle}>
            + Create Listing
          </Link>
        )}

        {userInfo ? (
          // --- If user is logged IN ---
          <>
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