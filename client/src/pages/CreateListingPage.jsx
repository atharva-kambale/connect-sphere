// client/src/pages/CreateListingPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';

// --- (Styles are the same) ---
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
const textAreaStyle = {
  ...inputStyle,
  minHeight: '100px',
  fontFamily: 'sans-serif',
};
const fileInputStyle = {
  ...inputStyle,
  padding: '0.6rem', // Tweak padding for file input
};
const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '4px',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
  opacity: 1, // Will be set to 0.5 when disabled
};
// --- (End of styles) ---

const CreateListingPage = () => {
  // 1. Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null); // State for the file
  
  // 2. Loading & Error state
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // 3. New file handler
  const fileHandler = (e) => {
    const file = e.target.files[0]; // Get the first file
    setImage(file);
  };

  // 4. Updated submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!image) {
      setError('Please upload an image');
      return;
    }

    setUploading(true);

    // --- STEP 1: Upload the image ---
    const formData = new FormData();
    formData.append('image', image); // 'image' must match 'upload.single('image')' in backend
    
    // Config for file upload
    const uploadConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    let imageUrl = '';

    try {
      const { data } = await axios.post('/api/upload', formData, uploadConfig);
      imageUrl = data.imageUrl; // Get the URL from Cloudinary
    } catch (uploadError) {
      console.error('Image upload failed:', uploadError);
      setError('Image upload failed. Please try again.');
      setUploading(false);
      return;
    }

    // --- STEP 2: Create the listing with the new imageUrl ---
    try {
      const listingData = {
        title,
        description,
        price: Number(price),
        category,
        imageUrl, // Use the URL from Step 1
      };
      
      const listingConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('/api/listings', listingData, listingConfig);

      setUploading(false);
      navigate('/'); // Success! Go to homepage
    } catch (createError) {
      console.error('Listing creation failed:', createError);
      setError('Listing creation failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <FormContainer>
      <h1>Create New Listing</h1>
      <form onSubmit={submitHandler} style={formStyle}>
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="title">Title</label>
          <input
            type="text" id="title" value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle} required
          />
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description" value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={textAreaStyle} required
          />
        </div>

        {/* Price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="price">Price ($)</label>
          <input
            type="number" id="price" value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle} required
          />
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="category">Category</label>
          <input
            type="text" id="category"
            placeholder="e.g., Books, Furniture, Electronics"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle} required
          />
        </div>

        {/* --- Image Upload (NEW) --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="image">Image</label>
          <input
            type="file" id="image"
            accept="image/png, image/jpeg, image/jpg"
            onChange={fileHandler}
            style={fileInputStyle} required
          />
        </div>
        {/* --- End of Image Upload --- */}

        {uploading && <p>Uploading... Please wait...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          style={{ ...buttonStyle, opacity: uploading ? 0.5 : 1 }}
          disabled={uploading} // Disable button while uploading
        >
          {uploading ? 'Submitting...' : 'Create Listing'}
        </button>
      </form>
    </FormContainer>
  );
};

export default CreateListingPage;