// client/pages/ListingDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Rating from '../components/Rating.jsx';

const ListingDetailPage = () => {
  // ... (State and useEffect logic are the same) ...
  const { id: listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchListingAndReviews = async () => {
      try {
        setLoading(true);
        const { data: listingData } = await axios.get(`/api/listings/${listingId}`);
        setListing(listingData);
        if (listingData.imageUrls && listingData.imageUrls.length > 0) {
          setMainImage(listingData.imageUrls[0]);
        }
        const sellerId = listingData.user._id;
        const { data: reviewsData } = await axios.get(`/api/reviews/${sellerId}`);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load listing or reviews.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListingAndReviews();
  }, [listingId]);
  
  // We check for user *after* loading, inside the main div
  const isOwner = !loading && userInfo?._id === listing?.user._id;
  const chatUrl = !loading && `/chat/${listing?._id}/${userInfo?._id}/${listing?.user._id}`;

  return (
    // THIS IS THE FIX: We add 'min-h-screen' to the container
    <div className="max-w-6xl mx-auto p-4 pt-24 min-h-screen"> 
      
      {loading ? (
        <h2 className="text-center pt-8 text-xl font-semibold dark:text-white">Loading...</h2>
      ) : error ? (
        <h2 className="text-center pt-8 text-xl font-semibold text-red-600">{error}</h2>
      ) : !listing ? (
        <h2 className="text-center pt-8 text-xl font-semibold dark:text-white">Listing not found.</h2>
      ) : (
        // Once loaded, we wrap the content in a fade-in animation
        <div className="animate-in fade-in duration-500">
          {/* Top Container for Listing Details */}
          <div className="bg-white rounded-xl shadow-xl p-8 grid md:grid-cols-2 gap-10
                          dark:bg-gray-800 dark:border dark:border-gray-700">
            {/* ... (rest of the content is the same) ... */}
          </div>
          {/* Reviews Section */}
          <div className="mt-8 bg-white rounded-xl shadow-xl p-8 dark:bg-gray-800 dark:border dark:border-gray-700">
            {/* ... (rest of the content is the same) ... */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;