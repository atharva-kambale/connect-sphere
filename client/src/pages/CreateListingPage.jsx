// client/pages/CreateListingPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';

const CreateListingPage = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  
  // Image state
  const [images, setImages] = useState([]); // Will hold the File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Will hold data URLs for preview
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // File handler for multiple images
  const fileHandler = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError('You can only upload a maximum of 5 images.');
      return;
    }
    setError(null);

    // Revoke old object URLs to prevent memory leaks
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    setImages(files);
    
    // Create new previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setUploading(true);

    // --- STEP 1: Upload all images ---
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image); 
    });
    
    const uploadConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    let imageUrls = [];

    try {
      const { data } = await axios.post('/api/upload', formData, uploadConfig);
      imageUrls = data.imageUrls;
    } catch (uploadError) {
      console.error('Image upload failed:', uploadError);
      setError('Image upload failed. Please try again.');
      setUploading(false);
      return;
    }

    // --- STEP 2: Create the listing with the array of URLs ---
    try {
      const listingData = {
        title,
        description,
        price: Number(price),
        category,
        imageUrls,
      };
      
      const listingConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('/api/listings', listingData, listingConfig);

      setUploading(false);
      // Clean up object URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      navigate('/'); // Success!
    } catch (createError) {
      setError(createError.response?.data?.message || 'Listing creation failed');
      setUploading(false);
    }
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create New Listing</h1>
      
      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        
        {/* Title */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="title" className="font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="description" className="font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg min-h-[100px] focus:ring-4 focus:ring-blue-200"
            required
          />
        </div>

        {/* Price and Category (side-by-side using Tailwind flex) */}
        <div className="flex space-x-4">
          <div className="flex flex-col space-y-1 w-1/2">
            <label htmlFor="price" className="font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex flex-col space-y-1 w-1/2">
            <label htmlFor="category" className="font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              placeholder="e.g., Books, Furniture"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="images" className="font-medium text-gray-700">Images (Max 5)</label>
          <p className="text-xs text-gray-500">Note: Uploading new images will replace all old ones.</p>
          <input
            type="file"
            id="images"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            onChange={fileHandler}
            className="p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            required
          />
        </div>
        
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 p-3 border border-gray-200 rounded-lg">
            {imagePreviews.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`Preview ${index + 1}`} 
                className="w-20 h-20 object-cover rounded-md border border-gray-300" 
              />
            ))}
          </div>
        )}

        {/* Messages */}
        {uploading && <p className="text-blue-600 font-semibold">Uploading and Submitting... Please wait...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className={`p-3.5 rounded-lg text-lg font-semibold transition duration-150 shadow-md ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          disabled={uploading}
        >
          {uploading ? 'Processing...' : 'Create Listing'}
        </button>
      </form>
    </FormContainer>
  );
};

export default CreateListingPage;