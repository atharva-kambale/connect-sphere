// client/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard.jsx';
import Hero from '../components/Hero.jsx'; // 1. Import the new Hero component

// --- (Styles are the same) ---
const pageStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1rem',
};
const headingStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
};
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
  marginTop: '1.5rem',
};
const searchFormStyle = {
  display: 'flex',
  margin: '1.5rem 0',
  gap: '10px',
};
const searchInputStyle = {
  flexGrow: 1,
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
};
const searchButtonStyle = {
  padding: '0 1.5rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '4px',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
};
const categoryContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '1.5rem',
};
const categoryButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  border: '1px solid #007bff',
  borderRadius: '20px',
  background: '#fff',
  color: '#007bff',
  cursor: 'pointer',
};
const activeCategoryButtonStyle = {
  ...categoryButtonStyle,
  background: '#007bff',
  color: '#fff',
};
// --- (End of Styles) ---

const CATEGORIES = ['All', 'Books', 'Furniture', 'Electronics', 'Clothing', 'Other'];

const HomePage = () => {
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
    <div style={pageStyle}>
      {/* 2. Add the Hero component here */}
      <Hero />
      
      <h1 style={headingStyle}>Marketplace</h1>
      
      <form onSubmit={searchSubmitHandler} style={searchFormStyle}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for items..."
          style={searchInputStyle}
        />
        <button type="submit" style={searchButtonStyle}>
          Search
        </button>
      </form>

      <div style={categoryContainerStyle}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            style={category === cat ? activeCategoryButtonStyle : categoryButtonStyle}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* 3. Render loading/error/listings (same as before) */}
      {isLoading ? (
        <h2 style={headingStyle}>Loading listings...</h2>
      ) : error ? (
        <h2 style={{ ...headingStyle, color: 'red' }}>Error: {error}</h2>
      ) : listings.length === 0 ? (
        <p style={{ marginTop: '2rem' }}>
          No listings found. {searchTerm && 'Try a different search term.'}
        </p>
      ) : (
        <div style={gridStyle}>
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;