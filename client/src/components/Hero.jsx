// client/src/components/Hero.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// --- (Styles) ---
const heroStyle = {
  position: 'relative', // Needed for the overlay
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '2rem',
  background: 'url("https://images.unsplash.com/photo-1524678606370-a47625cb810c?q=80&w=1769&auto=format&fit=crop") center center/cover no-repeat',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.4)', // Dark overlay
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: '1rem',
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: 'white',
  marginBottom: '0.5rem',
};

const subtitleStyle = {
  fontSize: '1.2rem',
  color: '#eee',
  marginBottom: '1.5rem',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: 'bold',
};
// --- (End of Styles) ---


const Hero = () => {
  return (
    <div style={heroStyle}>
      <div style={overlayStyle}>
        <h1 style={titleStyle}>Connect Sphere</h1>
        <p style={subtitleStyle}>Your Hyperlocal University Marketplace</p>
        <Link to="/create-listing" style={buttonStyle}>
          Sell Your Stuff
        </Link>
      </div>
    </div>
  );
};

export default Hero;