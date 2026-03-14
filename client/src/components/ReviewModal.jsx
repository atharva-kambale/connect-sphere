// client/components/ReviewModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ReviewModal = ({ sellerId, listingId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
      
      await axios.post(`/api/reviews/${sellerId}`, reviewData, config);
      
      setSuccess('Thank you! Your review has been submitted.');
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    // Modal Overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 
                   transform transition-all duration-300 scale-100
                   dark:bg-gray-800 dark:border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Message */}
        {success ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">{success}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Closing modal...</p>
          </div>
        ) : (
          // Review Form
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Leave a Review</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 text-3xl dark:text-gray-500 dark:hover:text-gray-300"
                onClick={onClose}
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              
              {/* Star Rating */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">Rating:</label>
                <div 
                  className="flex justify-center space-x-2 text-4xl text-gray-300 dark:text-gray-600"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <span
                      key={starValue}
                      className={`cursor-pointer transition-colors ${
                        starValue <= (hoverRating || rating)
                          ? 'text-yellow-400'
                          : 'hover:text-yellow-200'
                      }`}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Comment */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="comment" className="font-medium text-gray-700 dark:text-gray-300">Comment:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg min-h-[100px] 
                             focus:ring-4 focus:ring-blue-200
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Share your experience with the seller..."
                  required
                />
              </div>

              {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold 
                           hover:bg-blue-700 transition duration-150 shadow-md"
              >
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;