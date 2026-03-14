// client/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard.jsx';
import Hero from '../components/Hero.jsx';

const CATEGORIES = ['All', 'Books', 'Furniture', 'Electronics', 'Clothing', 'Other'];

const HomePage = () => {
  // ... (State and functions are the same) ...
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        let url = '/api/listings?';
        if (searchTerm) url += `keyword=${searchTerm}&`;
        if (category && category !== 'All') url += `category=${category}&`;
        const { data } = await axios.get(url);
        setListings(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [searchTerm, category]);

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    setSearchTerm(keyword);
  };
  
  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSearchTerm('');
    setKeyword('');
  };

  return (
    // THIS IS THE FIX: We add 'min-h-screen' to the container
    <div className="max-w-6xl mx-auto p-4 pt-24 min-h-screen"> 
      
      <Hero />
      
      {/* ... (Search & Filter Section - no change) ... */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200
                      dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={searchSubmitHandler} className="flex space-x-3 mb-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for textbooks, furniture, and more..."
            className="flex-grow p-3 border border-gray-300 rounded-lg 
                       focus:ring-4 focus:ring-blue-200 transition-all
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
          />
          <button type="submit" className="px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold 
                                           hover:bg-blue-700 transition duration-150 shadow-md">
            Search
          </button>
        </form>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Browse by Category
        </h3>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 text-sm rounded-full font-semibold transition duration-150 ${
                category === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Listings Grid */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-4">
          {searchTerm ? `Search Results for "${searchTerm}"` : `${category} Items`}
        </h2>
        
        {/* We check for loading *inside* the main div */}
        {isLoading ? (
          <p className="text-lg text-gray-500 dark:text-gray-400">Loading listings...</p>
        ) : error ? (
          <p className="text-lg text-red-600">{error}</p>
        ) : listings.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">No Listings Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or be the first to post in this category!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;