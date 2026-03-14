// client/pages/InboxPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const InboxPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userInfo) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('/api/conversations', config);
        setConversations(data);
        
      } catch (err) {
        setError('Failed to load conversations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userInfo]);

  return (
    // Main container with top padding
    <div className="max-w-4xl mx-auto p-4 pt-24 min-h-screen">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200
                      dark:bg-gray-800 dark:border-gray-700">
        
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4
                       dark:text-white dark:border-gray-700">
          My Inbox
        </h1>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading conversations...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">You have no conversations yet.</p>
        ) : (
          // --- THIS IS THE FIXED SECTION ---
          // The placeholder comment is replaced with the real code
          <div className="space-y-4 animate-in fade-in duration-500">
            {conversations.map((conv) => (
              <Link 
                to={conv.chatUrl} 
                key={conv._id} 
                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm 
                           hover:shadow-md hover:bg-gray-50 transition duration-150
                           dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {/* Image */}
                <img
                  src={conv.listing?.imageUrl || 'https://via.placeholder.com/60'}
                  alt={conv.listing?.title}
                  className="w-16 h-16 rounded-lg object-cover mr-4 border dark:border-gray-600"
                />
                
                {/* Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 truncate
                                 dark:text-white">
                    {conv.listing?.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Chat with {conv.withUser.name}
                  </p>
                  <p className="text-sm text-gray-500 italic truncate mt-1
                                dark:text-gray-400">
                    {conv.lastMessage ? `"${conv.lastMessage.content}"` : 'No messages yet'}
                  </p>
                </div>
                
                {/* Timestamp */}
                <div className="text-xs text-gray-400 self-start ml-2 dark:text-gray-500">
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
          // --- END OF FIX ---
        )}
      </div>
    </div>
  );
};

export default InboxPage;