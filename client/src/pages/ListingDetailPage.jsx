// client/pages/ListingDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// --- (Styles - Updated) ---
const pageStyle = {
  maxWidth: '1000px', // A bit wider for the gallery
  margin: '2rem auto',
  padding: '2rem',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr', // Give image column a bit more space
  gap: '2.5rem',
};

// -- NEW IMAGE GALLERY STYLES --
const galleryStyle = {
  display: 'flex',
  flexDirection: 'column', // Main image on top, thumbnails below
};
const mainImageStyle = {
  width: '100%',
  height: '450px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: '1px solid #eee',
};
const thumbnailContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '1rem',
};
const thumbnailStyle = {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '4px',
  border: '2px solid transparent', // Default border
  cursor: 'pointer',
};
const activeThumbnailStyle = {
  ...thumbnailStyle,
  border: '2px solid #007bff', // Active border
  boxShadow: '0 0 5px rgba(0,123,255,0.5)',
};
// -- END GALLERY STYLES --

const infoStyle = {
  display: 'flex',
  flexDirection: 'column',
};
const titleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
};
const priceStyle = {
  fontSize: '1.75rem',
  fontWeight: 'bold',
  color: '#007bff',
  marginBottom: '1rem',
};
const descStyle = {
  fontSize: '1rem',
  color: '#555',
  lineHeight: '1.6',
  marginBottom: '1.5rem',
};
const detailStyle = {
  fontSize: '0.9rem',
  color: '#777',
  marginBottom: '0.5rem',
};
const buttonStyle = {
  display: 'inline-block',
  width: '100%',
  padding: '1rem',
  marginTop: '1rem',
  background: '#28a745',
  color: 'white',
  textDecoration: 'none',
  textAlign: 'center',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 'bold',
};
// --- (End of Styles) ---

const ListingDetailPage = () => {
  const { id: listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- 1. NEW STATE FOR GALLERY ---
  const [mainImage, setMainImage] = useState('');
  // --- END NEW STATE ---

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/listings/${listingId}`);
        setListing(data);
        
        // --- 2. SET THE DEFAULT MAIN IMAGE ---
        if (data.imageUrls && data.imageUrls.length > 0) {
          setMainImage(data.imageUrls[0]);
        }
        // --- END ---

      } catch (err) {
        setError('Failed to load listing.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;
  if (!listing) return <h2>Listing not found.</h2>;

  const isOwner = userInfo?._id === listing.user._id; // We populated 'user'
  const chatUrl = `/chat/${listing._id}/${userInfo?._id}/${listing.user._id}`;

  return (
    <div style={pageStyle}>
      {/* Column 1: Image Gallery */}
      <div style={galleryStyle}>
        {/* Main Image */}
        <img 
          src={mainImage} 
          alt={listing.title} 
          style={mainImageStyle} 
        />
        
        {/* Thumbnail Gallery */}
        <div style={thumbnailContainerStyle}>
          {listing.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Thumbnail ${index + 1}`}
              // 3. SET ACTIVE STYLE AND CLICK HANDLER
              style={url === mainImage ? activeThumbnailStyle : thumbnailStyle}
              onClick={() => setMainImage(url)}
            />
          ))}
        </div>
      </div>

      {/* Column 2: Info */}
      <div style={infoStyle}>
        <h1 style={titleStyle}>{listing.title}</h1>
        <p style={priceStyle}>${listing.price}</p>
        <p style={detailStyle}>
          <strong>Sold by:</strong> {listing.user.name}
        </p>
        <p style={detailStyle}>
          <strong>University:</strong> {listing.university}
        </p>
        <p style={detailStyle}><strong>Category:</strong> {listing.category}</p>
        
        <h3 style={{ marginTop: '1rem' }}>Description:</h3>
        <p style={descStyle}>{listing.description}</p>
        
        <p style={detailStyle}>
          <strong>Posted:</strong> {new Date(listing.createdAt).toLocaleDateString()}
        </p>

        {/* 4. "Message Seller" button (no change) */}
        {userInfo && !isOwner && (
          <Link to={chatUrl} style={buttonStyle}>
            Message Seller
          </Link>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage;