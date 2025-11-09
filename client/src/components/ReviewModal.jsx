// client/src/components/ReviewModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// --- (Styles) ---
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  width: '100%',
  maxWidth: '500px',
  position: 'relative',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'transparent',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#888',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const starContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5rem',
  fontSize: '2rem',
};

const starStyle = {
  cursor: 'pointer',
  color: '#ccc',
};

const starActiveStyle = {
  ...starStyle,
  color: '#f0ad4e', // Yellow star
};

const textAreaStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  minHeight: '100px',
  fontFamily: 'sans-serif',
};

const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '4px',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
};
// --- (End of Styles) ---

// This component takes 3 props:
// - sellerId: The user we are reviewing
// - listingId: The listing the review is for
// - onClose: The function to call to close this modal
const ReviewModal = ({ sellerId, listingId, onClose }) => {
  const [rating, setRating] = useState(0); // 0-5 stars
  const [hoverRating, setHoverRating] = useState(0); // For the hover effect
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const reviewData = {
        rating,
        comment,
        listingId,
      };
      
      // Call our new API endpoint
      await axios.post(`/api/reviews/${sellerId}`, reviewData, config);
      
      setSuccess('Thank you! Your review has been submitted.');
      // Close the modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  // If the 'success' state is set, just show the success message
  if (success) {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <h2 style={{ textAlign: 'center', color: 'green' }}>{success}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      {/* This stops the overlay from closing when clicking *inside* the content */}
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '1rem' }}>Leave a Review</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Star Rating */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Rating:</label>
            <div 
              style={starContainerStyle}
              onMouseLeave={() => setHoverRating(0)} // Reset hover
            >
              {[1, 2, 3, 4, 5].map((starValue) => (
                <span
                  key={starValue}
                  style={starValue <= (hoverRating || rating) ? starActiveStyle : starStyle}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                >
                  &#9733; {/* Star character */}
                </span>
              ))}
            </div>
          </div>
          
          {/* Comment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={textAreaStyle}
              placeholder="Share your experience with the seller..."
              required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button type="submit" style={buttonStyle}>
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;