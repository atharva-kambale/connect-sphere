// client/src/components/Rating.jsx

import React from 'react';

// --- (Styles) ---
const starStyle = {
  color: '#f0ad4e', // Yellow star
  marginRight: '2px',
};
const ratingContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '0.5rem 0',
};
const textStyle = {
  fontSize: '0.9rem',
  color: '#777',
  marginLeft: '0.5rem',
};
// --- (End of Styles) ---

const Rating = ({ value, text }) => {
  // This component will show 5 stars, filled in based on the 'value' prop
  return (
    <div style={ratingContainerStyle}>
      <span>
        <i style={starStyle}>
          {/* Full star, half star, or empty star */}
          {value >= 1 ? '★' : value >= 0.5 ? '✫' : '☆'}
        </i>
        <i style={starStyle}>
          {value >= 2 ? '★' : value >= 1.5 ? '✫' : '☆'}
        </i>
        <i style={starStyle}>
          {value >= 3 ? '★' : value >= 2.5 ? '✫' : '☆'}
        </i>
        <i style={starStyle}>
          {value >= 4 ? '★' : value >= 3.5 ? '✫' : '☆'}
        </i>
        <i style={starStyle}>
          {value >= 5 ? '★' : value >= 4.5 ? '✫' : '☆'}
        </i>
      </span>
      {/* Show text like " (10 reviews)" */}
      {text && <span style={textStyle}>{text}</span>}
    </div>
  );
};

export default Rating;