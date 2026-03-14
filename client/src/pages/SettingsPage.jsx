// client/pages/SettingsPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice.js';

// This is the main content for the "Profile" tab
const ProfileSettings = ({ userInfo, onUpdate, onMessage }) => {
  const dispatch = useDispatch();

  // Form state
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [university, setUniversity] = useState(userInfo?.university || '');
  
  // Image state
  const [profilePic, setProfilePic] = useState(userInfo?.profilePictureUrl || '');
  const [banner, setBanner] = useState(userInfo?.bannerImageUrl || '');
  const [uploading, setUploading] = useState(''); // 'profile' or 'banner' or ''

  // Image upload handler
  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(imageType);
    const formData = new FormData();
    formData.append('images', file); // Use 'images' (plural)
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data: uploadData } = await axios.post('/api/upload', formData, config);
      const imageUrl = uploadData.imageUrls[0];

      const { data: updatedUser } = await axios.put(
        '/api/users/me',
        { [imageType]: imageUrl },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      
      dispatch(setCredentials(updatedUser));
      
      if (imageType === 'profilePictureUrl') {
        setProfilePic(imageUrl);
      } else {
        setBanner(imageUrl);
      }
      onMessage({ type: 'success', text: 'Image updated!' });
    } catch (err) {
      onMessage({ type: 'error', text: 'Image upload failed' });
    } finally {
      setUploading('');
    }
  };

  // Text fields update handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      const updateData = { name, email, university };
      
      const { data } = await axios.put('/api/users/me', updateData, config);
      dispatch(setCredentials(data));
      onUpdate(data); // Pass new data up to parent
      onMessage({ type: 'success', text: 'Profile Updated!' });
      
    } catch (err) {
      onMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Image Upload Section */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Profile Images</h3>
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <img 
            src={profilePic} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
          />
          <div>
            <label htmlFor="profilePicInput" className="font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recommended ratio 1:1, max 5MB.</p>
            <input 
              type="file" id="profilePicInput" accept="image/png, image/jpeg"
              onChange={(e) => handleImageUpload(e, 'profilePictureUrl')}
              className="text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 
                         file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 
                         hover:file:bg-gray-200
                         dark:text-gray-400 dark:file:bg-gray-600 dark:file:text-gray-200 dark:hover:file:bg-gray-500"
            />
          </div>
        </div>
        {/* Banner Image */}
        <div className="flex items-center space-x-4">
          <img 
            src={banner} 
            alt="Banner" 
            className="w-24 h-14 object-cover rounded-md border-4 border-gray-200 dark:border-gray-600"
          />
          <div>
            <label htmlFor="bannerInput" className="font-medium text-gray-700 dark:text-gray-300">Banner Image</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recommended ratio 3:1, max 5MB.</p>
            <input 
              type="file" id="bannerInput" accept="image/png, image/jpeg"
              onChange={(e) => handleImageUpload(e, 'bannerImageUrl')}
              className="text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 
                         file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 
                         hover:file:bg-gray-200
                         dark:text-gray-400 dark:file:bg-gray-600 dark:file:text-gray-200 dark:hover:file:bg-gray-500"
            />
          </div>
        </div>
        {(uploading === 'profile' || uploading === 'banner') && <p className="text-blue-600 dark:text-blue-400">Uploading image...</p>}
      </div>

      <hr className="dark:border-gray-600"/>

      {/* Text Fields Form */}
      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">User Details</h3>
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} 
                 className="p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                 className="p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="university" className="font-medium text-gray-700 dark:text-gray-300">University</label>
          <input type="text" id="university" value={university} onChange={(e) => setUniversity(e.target.value)} 
                 className="p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-150 shadow-md">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// This is the (dummy) content for the "Security" tab
const SecuritySettings = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Account Security</h3>
      <p className="text-gray-600 dark:text-gray-300">Password change functionality would go here.</p>
      {/* You would put the password change form here */}
    </div>
  );
};


// This is the main page layout
const SettingsPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState(null);
  const [localUserInfo, setLocalUserInfo] = useState(userInfo);

  const handleUpdate = (newUserInfo) => {
    setLocalUserInfo(newUserInfo);
  };
  
  const handleMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000); // Clear message after 3s
  };
  
  const tabClass = (tabName) => 
    `w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
      activeTab === tabName
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
    }`;
  
  return (
    // Main page container with top padding
    <div className="max-w-6xl mx-auto p-4 pt-24">
      
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
        Account Settings
      </h1>
      
      {/* Global Message Bar */}
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.type === 'error' 
            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Sidebar Navigation */}
        <div className="md:col-span-1">
          <nav className="flex flex-col space-y-2">
            <button 
              className={tabClass('profile')}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={tabClass('security')}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            {/* Add more links here like 'Billing', 'Notifications' */}
          </nav>
        </div>

        {/* Column 2: Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200
                          dark:bg-gray-800 dark:border-gray-700">
            
            {/* Show content based on active tab */}
            {activeTab === 'profile' && (
              <ProfileSettings 
                userInfo={localUserInfo} 
                onUpdate={handleUpdate}
                onMessage={handleMessage} 
              />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettings />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;