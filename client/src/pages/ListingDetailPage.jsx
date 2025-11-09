// client/pages/ListingDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Rating from '../components/Rating.jsx';

const ListingDetailPage = () => {
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
        // FETCH LISTING (API Call 1)
        const { data: listingData } = await axios.get(`/api/listings/${listingId}`);
        setListing(listingData);

        if (listingData.imageUrls && listingData.imageUrls.length > 0) {
          setMainImage(listingData.imageUrls[0]);
        }

        // FETCH REVIEWS (API Call 2)
        const sellerId = listingData.user._id;
        const { data: reviewsData } = await axios.get(`/api/reviews/${sellerId}`);
        setReviews(reviewsData);

      } catch (err) {
        setError('Failed to load listing or reviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchListingAndReviews();
  }, [listingId]);

  if (loading) return <div className="text-center mt-10 text-xl font-semibold">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-xl font-semibold text-red-600">{error}</div>;
  if (!listing) return <div className="text-center mt-10 text-xl font-semibold">Listing not found.</div>;

  const isOwner = userInfo?._id === listing.user._id;
  const chatUrl = `/chat/${listing._id}/${userInfo?._id}/${listing.user._id}`;

  return (
    <div className="max-w-6xl mx-auto p-4">
      
      {/* Top Container for Listing Details */}
      <div className="bg-white rounded-xl shadow-xl p-8 grid md:grid-cols-2 gap-10">
        
        {/* Column 1: Image Gallery */}
        <div className="flex flex-col">
          {/* Main Image */}
          <img 
            src={mainImage} 
            alt={listing.title} 
            className="w-full h-[450px] object-cover rounded-lg border border-gray-200 shadow-md" 
          />
          
          {/* Thumbnail Gallery */}
          <div className="flex flex-wrap gap-3 mt-4">
            {listing.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-150 ${url === mainImage ? 'border-4 border-blue-500 shadow-lg' : 'border border-gray-300 hover:border-blue-300'}`}
                onClick={() => setMainImage(url)}
              />
            ))}
          </div>
        </div>

        {/* Column 2: Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-4">${listing.price}</p>
          
          {/* Seller and Rating */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-lg text-gray-700">
              <strong>Sold by:</strong> {listing.user.name}
            </p>
            <Rating 
              value={listing.user.rating} 
              text={` (${listing.user.numReviews} reviews)`} 
            />
          </div>

          {/* Details */}
          <p className="text-md text-gray-600 mb-1">
            <strong>University:</strong> {listing.university}
          </p>
          <p className="text-md text-gray-600 mb-1"><strong>Category:</strong> {listing.category}</p>
          <p className="text-md text-gray-600 mb-4">
            <strong>Posted:</strong> {new Date(listing.createdAt).toLocaleDateString()}
          </p>
          
          <h3 className="text-xl font-semibold mt-2 mb-2 text-gray-800">Description</h3>
          <p className="text-gray-700 leading-relaxed mb-6 flex-grow">{listing.description}</p>
          
          {/* Message Button */}
          {userInfo && !isOwner && (
            <Link 
              to={chatUrl} 
              className="bg-green-500 text-white p-3.5 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-150 text-center shadow-lg"
            >
              Message Seller
            </Link>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">Reviews for {listing.user.name}</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <strong className="text-lg text-gray-700">{review.author.name}</strong>
                  <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <Rating value={review.rating} />
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage;