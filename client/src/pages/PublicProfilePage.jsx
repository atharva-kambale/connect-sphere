// client/pages/PublicProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link }from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ListingCard from '../components/ListingCard.jsx';
import Rating from '../components/Rating.jsx';

// --- Sidebar component (No change) ---
const ProfileSidebar = ({ user, isOwnProfile }) => {
  return (
    <div className="flex flex-col space-y-6">
      {isOwnProfile && (
        <Link 
          to="/settings"
          className="w-full flex justify-center px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
        >
          Edit Profile
        </Link>
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Seller Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total Reviews</span>
            <span className="font-bold text-lg text-gray-800 dark:text-white">{user.numReviews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Average Rating</span>
            <Rating value={user.rating} text="" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Joined</span>
            <span className="font-semibold text-gray-800 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Feature coming soon! Badges for "First Sale," "Top Rated Seller," and more will appear here.</p>
      </div>
    </div>
  );
};
// --- END Sidebar ---


const PublicProfilePage = () => {
  const { userId } = useParams();
  const { userInfo: loggedInUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('listings');
  const isOwnProfile = loggedInUser?._id === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const { data: userData } = await axios.get(`/api/users/${userId}`);
        setUser(userData);
        const { data: listingsData } = await axios.get(`/api/listings?user=${userId}`);
        setListings(listingsData);
        const { data: reviewsData } = await axios.get(`/api/reviews/${userId}`);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId]);

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
        await axios.delete(`/api/listings/${listingId}`, config);
        setListings(listings.filter((listing) => listing._id !== listingId));
      } catch (err) {
        alert('Failed to delete listing.');
      }
    }
  };
  
  const tabClass = (tabName) => 
    `pb-3 px-1 font-semibold border-b-4 transition-all ${
      activeTab === tabName
        ? 'border-blue-600 text-gray-900 dark:text-white'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300'
    }`;

  // The stray comment before this return statement has been REMOVED
  return (
    <div className="max-w-6xl mx-auto p-4 pt-24 min-h-screen">
      
      {loading ? (
        <div className="text-center pt-8 text-xl font-semibold dark:text-white">Loading profile...</div>
      ) : error ? (
        <div className="text-center pt-8 text-xl font-semibold text-red-600">{error}</div>
      ) : !user ? (
        <div className="text-center pt-8 text-xl font-semibold dark:text-white">User not found.</div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN (2/3) --- */}
            <div className="md:col-span-2">
              <div 
                className="h-48 md:h-64 bg-cover bg-center rounded-xl shadow-lg"
                style={{ backgroundImage: `url(${user.bannerImageUrl})` }}
              ></div>
              <div className="px-6">
                <div className="flex justify-between items-end -mt-16 md:-mt-20">
                  <img 
                    src={user.profilePictureUrl} 
                    alt={user.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-lg"
                  />
                  {/* "Edit Profile" button is in the sidebar */}
                </div>
                <div className="mt-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{user.name}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">@{user.name.toLowerCase().replace(' ', '')}2025</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 mt-8 px-6">
                <button className={tabClass('listings')} onClick={() => setActiveTab('listings')}>
                  Listings ({listings.length})
                </button>
                <button className={tabClass('reviews')} onClick={() => setActiveTab('reviews')}>
                  Reviews ({reviews.length})
                </button>
              </nav>

              <div className="mt-8 px-6">
                {isOwnProfile && activeTab === 'listings' && (
                  <Link 
                    to="/create-listing" 
                    className="flex justify-center items-center w-full bg-green-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-150 shadow-md mb-6"
                  >
                    + Create New Listing
                  </Link>
                )}
                
                {activeTab === 'listings' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 col-span-full">This user has no listings.</p>
                    ) : (
                      listings.map((listing) => (
                        <ListingCard
                          key={listing._id}
                          listing={listing}
                          onDelete={isOwnProfile ? handleDelete : null}
                          editLink={isOwnProfile ? `/edit-listing/${listing._id}` : null}
                        />
                      ))
                    )}
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6
                                  dark:bg-gray-800 dark:border-gray-700">
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">This user has no reviews.</p>
                    ) : (
                      reviews.map((review) => (
                        <div key={review._id} className="border-b pb-4 last:border-b-0 dark:border-gray-700">
                          <div className="flex justify-between items-start">
                            <strong className="text-lg text-gray-700 dark:text-gray-200">{review.author.name}</strong>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Rating value={review.rating} />
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* --- RIGHT COLUMN (1/3) --- */}
            <div className="md:col-span-1 md:pt-4">
              <ProfileSidebar user={user} isOwnProfile={isOwnProfile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;