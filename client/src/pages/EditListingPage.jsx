// client/pages/EditListingPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';

// --- (Styles are the same as CreateListingPage) ---
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
  padding: '0.6rem',
};
const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '4px',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
  opacity: 1,
};
const previewContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '10px',
};
const previewImageStyle = {
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '4px',
};
// --- (End of Styles) ---

const EditListingPage = () => {
  const { id: listingId } = useParams(); // Get listing ID from URL
  const navigate = useNavigate();

  // 1. Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  
  // Image state
  const [newImages, setNewImages] = useState([]); // Holds new File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Holds all previews (old and new)
  const [originalImageUrls, setOriginalImageUrls] = useState([]); // Holds old URLs
  
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  // 2. --- FETCH EXISTING LISTING DATA ---
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`/api/listings/${listingId}`);
        // Pre-fill the form
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setCategory(data.category);
        setOriginalImageUrls(data.imageUrls); // Save original URLs
        setImagePreviews(data.imageUrls); // Show original images
        setLoading(false);
      } catch (err) {
        setError('Failed to load listing. You may not be the owner.');
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);
  // --- END FETCH ---

  // 3. --- File handler for NEW images ---
  const fileHandler = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('You can only upload a maximum of 5 images.');
      return;
    }
    setError(null);
    setNewImages(files); // Save the new File objects
    
    // Create previews for *new* images
    const previews = files.map(file => URL.createObjectURL(file));
    // Show *only* the new previews
    setImagePreviews(previews);
  };

  // 4. --- Handle form submission ---
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    let finalImageUrls = originalImageUrls; // Start with the old URLs

    // --- STEP 1: If new images were selected, upload them ---
    if (newImages.length > 0) {
      const formData = new FormData();
      newImages.forEach(image => formData.append('images', image));
      
      const uploadConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        const { data } = await axios.post('/api/upload', formData, uploadConfig);
        finalImageUrls = data.imageUrls; // Set the URLs to the new ones
      } catch (uploadError) {
        setError('Image upload failed. Please try again.');
        setUploading(false);
        return;
      }
    }

    // --- STEP 2: Update the listing with all data ---
    try {
      const updateData = {
        title,
        description,
        price: Number(price),
        category,
        imageUrls: finalImageUrls, // Send the final array
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Call the PUT endpoint
      await axios.put(`/api/listings/${listingId}`, updateData, config);

      setUploading(false);
      // Revoke any new preview URLs
      if (newImages.length > 0) {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
      }
      navigate('/profile'); // Go back to profile on success
    } catch (createError) {
      setError('Listing update failed. Please try again.');
      setUploading(false);
    }
  };

  if (loading) return <h2>Loading listing...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <FormContainer>
      <h1>Edit Your Listing</h1>
      <form onSubmit={submitHandler} style={formStyle}>
        {/* Title, Description, Price, Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={textAreaStyle} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="price">Price ($)</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="category">Category</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} required />
        </div>

        {/* Image Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="images">Upload New Images (Max 5)</label>
          <p style={{fontSize: '0.8rem', color: '#666'}}>Note: Uploading new images will replace all old ones.</p>
          <input
            type="file" id="images" accept="image/png, image/jpeg, image/jpg"
            multiple onChange={fileHandler} style={fileInputStyle}
          />
        </div>
        
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div style={previewContainerStyle}>
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index + 1}`} style={previewImageStyle} />
            ))}
          </div>
        )}

        {uploading && <p>Updating... Please wait...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          style={{ ...buttonStyle, opacity: uploading ? 0.5 : 1 }}
          disabled={uploading}
        >
          {uploading ? 'Updating...' : 'Update Listing'}
        </button>
      </form>
    </FormContainer>
  );
};

export default EditListingPage;