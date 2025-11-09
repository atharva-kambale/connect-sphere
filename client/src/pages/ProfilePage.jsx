// client/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice.js';
import ListingCard from '../components/ListingCard.jsx';

// --- (Styles are the same) ---
const pageStyle = {
  maxWidth: '900px',
  margin: '2rem auto',
  padding: '1rem',
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gap: '2rem',
};
const formContainerStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};
const inputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
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
const listingsContainerStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '1.5rem',
  marginTop: '1.5rem',
};
const createListingButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '4px',
  background: '#28a745',
  color: 'white',
  cursor: 'pointer',
  textDecoration: 'none',
  textAlign: 'center',
  marginBottom: '1.5rem',
};
// --- (End of Styles) ---

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // Form state
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [university, setUniversity] = useState(userInfo?.university || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  // Listings state
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // Handle profile update
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const updateData = { name, email, university };
      if (password) updateData.password = password;
      
      const { data } = await axios.put('/api/users/me', updateData, config);
      dispatch(setCredentials(data));
      setMessage({ type: 'success', text: 'Profile Updated!' });
      
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };
  
  // Fetch user's listings
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/listings/my-listings', config);
        setMyListings(data);
      } catch (err) {
        console.error('Failed to fetch listings', err);
      } finally {
        setLoadingListings(false);
      }
    };
    
    fetchMyListings();
  }, [userInfo.token]);

  // Handle listing delete
  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/listings/${listingId}`, config);
        setMyListings(myListings.filter((listing) => listing._id !== listingId));
      } catch (err) {
        console.error('Failed to delete listing', err);
        alert('Failed to delete listing. Please try again.');
      }
    }
  };

  return (
    <div style={pageStyle}>
      {/* Column 1: Profile Update Form (No change) */}
      <div style={formContainerStyle}>
        <h2>My Profile</h2>
        <form onSubmit={submitHandler} style={formStyle}>
          {message && (
            <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
              {message.text}
            </p>
          )}
          {/* ... (all your form inputs) ... */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="university">University</label>
            <input type="text" id="university" value={university} onChange={(e) => setUniversity(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password">New Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Leave blank to keep the same" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" style={buttonStyle}>
            Update Profile
          </button>
        </form>
      </div>

      {/* Column 2: My Listings */}
      <div style={listingsContainerStyle}>
        <Link to="/create-listing" style={createListingButtonStyle}>
          + Create New Listing
        </Link>

        <h2>My Listings</h2>
        {loadingListings ? (
          <p>Loading your listings...</p>
        ) : myListings.length === 0 ? (
          <p>You have not posted any listings yet.</p>
        ) : (
          <div style={gridStyle}>
            {myListings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onDelete={handleDelete}
                // --- 1. PASS THE NEW EDIT LINK ---
                editLink={`/edit-listing/${listing._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;