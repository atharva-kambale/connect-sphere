// client/components/ListingCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing, onDelete, editLink }) => {
  const formattedDate = new Date(listing.createdAt).toLocaleDateString();

  // --- THIS IS THE FIX ---
  // Get the first image, or a placeholder if the array is empty
  const coverImage = listing.imageUrls && listing.imageUrls.length > 0
    ? listing.imageUrls[0]
    : 'https://via.placeholder.com/300x200?text=No+Image'; // Was 'rtx.placeholder.com'
  // --- END OF FIX ---

  // Stop link navigation if we are clicking a button
  const handleButtonWrapperClick = (e) => {
    e.preventDefault();
  }
  
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(listing._id);
  };

  return (
    // Card Wrapper
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col 
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                    dark:bg-gray-800 dark:border dark:border-gray-700">
      
      <Link to={`/listing/${listing._id}`} className="flex flex-col flex-grow">
        
        {/* Image */}
        <img
          src={coverImage}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={listing.title}>
            {listing.title}
          </h3>
          <p className="text-xl font-extrabold text-blue-600 my-1">${listing.price}</p>
          
          <div className="flex-grow">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {listing.university}
            </p>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Posted: {formattedDate}
          </p>
        </div>
      </Link>
      
      {/* Conditional Edit/Delete Buttons */}
      {onDelete && (
        <div className="flex w-full border-t border-gray-100 dark:border-gray-700" onClick={handleButtonWrapperClick}>
          <Link 
            to={editLink} 
            className="flex-1 p-3 text-center text-sm font-medium text-blue-600 bg-gray-50 
                       hover:bg-blue-100 transition-colors border-r dark:border-gray-700
                       dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
          >
            Edit
          </Link>
          <button 
            className="flex-1 p-3 text-center text-sm font-medium text-red-600 bg-gray-50 
                       hover:bg-red-100 transition-colors
                       dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingCard;