// client/pages/EditListingPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';

const EditListingPage = () => {
  const { id: listingId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  
  // Image state
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [originalImageUrls, setOriginalImageUrls] = useState([]);
  
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  // Fetch existing listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`/api/listings/${listingId}`);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setCategory(data.category);
        setOriginalImageUrls(data.imageUrls);
        setImagePreviews(data.imageUrls);
        setLoading(false);
      } catch (err) {
        setError('Failed to load listing. You may not be the owner.');
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  // File handler
  const fileHandler = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('You can only upload a maximum of 5 images.');
      return;
    }
    setError(null);
    setNewImages(files);
    
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    let finalImageUrls = originalImageUrls;

    // STEP 1: If new images were selected, upload them
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
        finalImageUrls = data.imageUrls;
      } catch (uploadError) {
        setError('Image upload failed. Please try again.');
        setUploading(false);
        return;
      }
    }

    // STEP 2: Update the listing
    try {
      const updateData = {
        title,
        description,
        price: Number(price),
        category,
        imageUrls: finalImageUrls,
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      await axios.put(`/api/listings/${listingId}`, updateData, config);

      setUploading(false);
      if (newImages.length > 0) {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
      }
      
      // --- THE FIX ---
      // Redirect back to the specific listing page instead of '/profile'
      navigate(`/listing/${listingId}`); 
      // ---------------

    } catch (createError) {
      setError(createError.response?.data?.message || 'Listing update failed');
      setUploading(false);
    }
  };

  if (loading) return <h2 className="text-center pt-24 text-xl font-semibold dark:text-white">Loading listing...</h2>;
  if (error) return <h2 className="text-center pt-24 text-xl font-semibold text-red-600">{error}</h2>;

  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center
                     dark:text-white">
        Edit Your Listing
      </h1>
      
      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        
        {/* Title */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="title" className="font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text" id="title" value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg 
                       focus:ring-4 focus:ring-blue-200
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="description" className="font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description" value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg min-h-[100px] 
                       focus:ring-4 focus:ring-blue-200
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Price and Category */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col space-y-1 w-full md:w-1/2">
            <label htmlFor="price" className="font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
            <input
              type="number" id="price" value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg 
                         focus:ring-4 focus:ring-blue-200
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="flex flex-col space-y-1 w-full md:w-1/2">
            <label htmlFor="category" className="font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input
              type="text" id="category"
              placeholder="e.g., Books, Furniture"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg 
                         focus:ring-4 focus:ring-blue-200
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Image Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="images" className="font-medium text-gray-700 dark:text-gray-300">Upload New Images (Max 5)</label>
          <p className="text-xs text-gray-500 dark:text-gray-400">Note: Uploading new images will replace all old ones.</p>
          <input
            type="file" id="images" accept="image/png, image/jpeg, image/jpg"
            multiple onChange={fileHandler}
            className="p-2 border border-gray-300 rounded-lg text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                       file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 
                       hover:file:bg-gray-200
                       dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300
                       dark:file:bg-gray-600 dark:file:text-gray-200 dark:hover:file:bg-gray-500"
          />
        </div>
        
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 p-3 border border-gray-200 rounded-lg
                          dark:border-gray-700">
            {imagePreviews.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`Preview ${index + 1}`} 
                className="w-20 h-20 object-cover rounded-md border border-gray-300
                           dark:border-gray-600" 
              />
            ))}
          </div>
        )}

        {/* Messages */}
        {uploading && <p className="text-blue-600 font-semibold dark:text-blue-400">Updating... Please wait...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className={`p-3.5 rounded-lg text-lg font-semibold transition duration-150 shadow-md ${
            uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={uploading}
        >
          {uploading ? 'Processing...' : 'Update Listing'}
        </button>
      </form>
    </FormContainer>
  );
};

export default EditListingPage;