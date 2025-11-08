// client/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard.jsx'; // Import our new component

// --- (Styles) ---
const pageStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1rem',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
  marginTop: '1.5rem',
};

const headingStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
};
// --- (End of Styles) ---

const HomePage = () => {
  // 1. State for listings, loading, and errors
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect to fetch data when the component loads
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        // 3. Call our public GET /api/listings endpoint
        const res = await axios.get('/api/listings');
        setListings(res.data); // Save the data in state
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
        console.error('Error fetching listings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []); // The empty array [] means this runs only ONCE

  // 4. Render loading or error messages
  if (isLoading) {
    return <h2 style={headingStyle}>Loading listings...</h2>;
  }

  if (error) {
    return <h2 style={{ ...headingStyle, color: 'red' }}>Error: {error}</h2>;
  }

  // 5. Render the listings
  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Marketplace</h1>
      <p>Browse items from students at your university!</p>
      
      {listings.length === 0 ? (
        <p style={{ marginTop: '2rem' }}>No listings found. Be the first to create one!</p>
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