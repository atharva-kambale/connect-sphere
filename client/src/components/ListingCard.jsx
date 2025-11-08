// client/src/components/ListingCard.jsx

import React from 'react';

// --- (Styles) ---
const cardStyle = {
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  // Removed padding, will add to content
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', // Hide overflow from image
};

const imageStyle = {
  width: '100%',
  height: '200px', // Fixed height for images
  objectFit: 'cover', // Cover the area, don't stretch
  background: '#f0f0f0', // Placeholder color
};

const contentStyle = {
  padding: '1rem', // Add padding to the content area
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
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
// --- (End of Styles) ---

const ListingCard = ({ listing }) => {
  const formattedDate = new Date(listing.createdAt).toLocaleDateString();

  return (
    <div style={cardStyle}>
      {/* 1. Add the Image! */}
      <img
        src={listing.imageUrl}
        alt={listing.title}
        style={imageStyle}
      />

      {/* 2. Wrap content in its own div */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{listing.title}</h3>
        <p style={priceStyle}>${listing.price}</p>
        <p style={infoStyle}>{listing.description}</p>
        <p style={infoStyle}>
          <strong>Category:</strong> {listing.category}
        </p>
        <p style={infoStyle}>
          <strong>University:</strong> {listing.university}
        </p>
        <p style={infoStyle}>
          <strong>Posted:</strong> {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default ListingCard;