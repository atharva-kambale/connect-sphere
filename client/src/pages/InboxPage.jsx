// client/src/pages/InboxPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// --- (Basic Styles) ---
const pageStyle = {
  maxWidth: '900px',
  margin: '2rem auto',
  padding: '1rem',
};

const headingStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '1.5rem',
};

const conversationCardStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '1rem',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'background color 0.2s',
};

const cardImageStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '4px',
  objectFit: 'cover',
  marginRight: '1rem',
};

const cardInfoStyle = {
  flexGrow: 1,
};

const cardTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
};

const cardUserStyle = {
  fontSize: '0.9rem',
  color: '#555',
  margin: '0.25rem 0',
};

const cardLastMsgStyle = {
  fontSize: '0.9rem',
  color: '#777',
  fontStyle: 'italic',
};
// --- (End of Styles) ---

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

        // 1. Call our new API endpoint
        const { data } = await axios.get('/api/conversations', config);
        
        // 'data' is the formatted array from our controller
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

  if (loading) {
    return <h2 style={headingStyle}>Loading Inbox...</h2>;
  }

  if (error) {
    return <h2 style={{ ...headingStyle, color: 'red' }}>{error}</h2>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>My Inbox</h1>
      {conversations.length === 0 ? (
        <p>You have no conversations yet.</p>
      ) : (
        <div>
          {conversations.map((conv) => (
            // 2. Link to the correct chat URL
            <Link 
              to={conv.chatUrl} 
              key={conv._id} 
              style={conversationCardStyle}
            >
              <img
                src={conv.listing?.imageUrl || 'https://via.placeholder.com/60'}
                alt={conv.listing?.title}
                style={cardImageStyle}
              />
              <div style={cardInfoStyle}>
                <h3 style={cardTitleStyle}>{conv.listing?.title}</h3>
                <p style={cardUserStyle}>Chat with {conv.withUser.name}</p>
                <p style={cardLastMsgStyle}>
                  {conv.lastMessage ? `"${conv.lastMessage.content}"` : 'No messages yet'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxPage;