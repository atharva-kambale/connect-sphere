// client/components/ListingCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// --- (Styles are the same) ---
const cardWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  overflow: 'hidden',
};
const cardLinkStyle = {
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'box-shadow 0.2s',
};
const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  background: '#f0f0f0',
};
const contentStyle = {
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  flexGrow: 1,
};
const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#333',
};
const priceStyle = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#007bff',
};
const infoStyle = {
  fontSize: '0.9rem',
  color: '#666',
};
const buttonContainerStyle = {
  display: 'flex',
  width: '100%',
};
const buttonBaseStyle = {
  flex: 1,
  padding: '0.75rem',
  border: 'none',
  borderTop: '1px solid #eee',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  background: '#fcfcfc',
  color: '#333',
  textDecoration: 'none', // For Link
  textAlign: 'center',  // For Link
};
const editButtonStyle = {
  ...buttonBaseStyle,
  color: '#007bff',
  borderRight: '1px solid #eee',
};
const deleteButtonStyle = {
  ...buttonBaseStyle,
  color: '#dc3545',
};
// --- (End of Styles) ---

// 1. --- ACCEPT NEW 'editLink' PROP ---
const ListingCard = ({ listing, onDelete, editLink }) => {
  const formattedDate = new Date(listing.createdAt).toLocaleDateString();

  const coverImage = listing.imageUrls && listing.imageUrls.length > 0
    ? listing.imageUrls[0]
    : 'https://via.placeholder.com/300x200';

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(listing._id);
  };
  
  // Stop link navigation if we are clicking a button
  const handleButtonWrapperClick = (e) => {
    // This stops the main card <Link> from firing
    e.preventDefault();
  }

  return (
    <div style={cardWrapperStyle}>
      <Link
        to={`/listing/${listing._id}`}
        style={cardLinkStyle}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        <img
          src={coverImage}
          alt={listing.title}
          style={imageStyle}
        />
        <div style={contentStyle}>
          <h3 style={titleStyle}>{listing.title}</h3>
          <p style={priceStyle}>${listing.price}</p>
          <p style={infoStyle}>
            <strong>University:</strong> {listing.university}
          </p>
          <p style={infoStyle}>
            <strong>Posted:</strong> {formattedDate}
          </p>
        </div>
        
        {/* 2. --- CONDITIONAL BUTTONS (Updated) --- */}
        {/* We use 'onDelete' to know if we are on the Profile page */}
        {onDelete && (
          <div style={buttonContainerStyle} onClick={handleButtonWrapperClick}>
            {/* 3. --- "Edit" button is now a Link --- */}
            <Link to={editLink} style={editButtonStyle}>
              Edit
            </Link>
            <button style={deleteButtonStyle} onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        )}
        {/* --- END OF CHANGE --- */}
      </Link>
    </div>
  );
};

export default ListingCard;