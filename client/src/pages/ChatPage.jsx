// client/pages/ChatPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from '../socket.js';
import axios from 'axios';
import ReviewModal from '../components/ReviewModal.jsx'; // 1. Import the modal

// --- (Styles) ---
const chatContainerStyle = {
  maxWidth: '800px',
  margin: '2rem auto',
  border: '1px solid #ccc',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '600px',
  background: '#fff',
};
// --- NEW HEADER STYLE ---
const chatHeaderStyle = {
  padding: '1rem',
  background: '#f1f1f1',
  borderBottom: '1px solid #ccc',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const reviewButtonStyle = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  background: '#f0ad4e',
  color: 'white',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 'bold',
};
// --- (Rest of styles are the same) ---
const messagesAreaStyle = {
  flexGrow: 1,
  padding: '1rem',
  overflowY: 'auto',
  background: '#f9f9f9',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};
const inputAreaStyle = {
  display: 'flex',
  borderTop: '1px solid #ccc',
};
const inputStyle = {
  flexGrow: 1,
  padding: '1rem',
  border: 'none',
  fontSize: '1rem',
};
const buttonStyle = {
  padding: '1rem',
  border: 'none',
  background: '#007bff',
  color: 'white',
  fontSize: '1rem',
  cursor: 'pointer',
};
const messageBubbleStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '18px',
  maxWidth: '70%',
  wordWrap: 'break-word',
};
const myMessageStyle = {
  ...messageBubbleStyle,
  background: '#007bff',
  color: 'white',
  alignSelf: 'flex-end',
};
const otherMessageStyle = {
  ...messageBubbleStyle,
  background: '#e9e9e9',
  color: '#333',
  alignSelf: 'flex-start',
};
// --- (End of Styles) ---

const ChatPage = () => {
  const { listingId, buyerId, sellerId } = useParams();
  const roomName = [buyerId, sellerId].sort().join('_') + `_${listingId}`;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. --- NEW STATE FOR MODAL ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  // --- END NEW STATE ---

  const { userInfo } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  // Check if the current user is the buyer
  const amIBuyer = userInfo._id === buyerId;

  // --- (Fetch History and Join Room) ---
  useEffect(() => {
    if (!roomName || !userInfo) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/messages/${roomName}`, config);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      } finally {
        setLoading(false);
      }
    };
    
    socket.emit('join_room', roomName);
    fetchHistory();
    
  }, [roomName, userInfo]);

  // --- (Listen for Messages) ---
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const incomingMessage = {
        content: data.message,
        sender: { _id: data.senderId, name: data.sender },
      };
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };
    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  // --- (Send Message) ---
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && userInfo && roomName) {
      const messageData = {
        room: roomName,
        message: message.trim(),
        sender: userInfo.name,
        senderId: userInfo._id,
        listingId: listingId,
        participants: [buyerId, sellerId],
      };
      socket.emit('send_message', messageData);
      
      const localMessage = {
        content: message.trim(),
        sender: { _id: userInfo._id, name: userInfo.name },
      };
      setMessages((prevMessages) => [...prevMessages, localMessage]);
      setMessage('');
    }
  };

  // --- (Auto-scroll) ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- (Render) ---
  return (
    <>
      <div style={chatContainerStyle}>
        {/* 3. --- NEW CHAT HEADER --- */}
        <div style={chatHeaderStyle}>
          <h3>Chat Room</h3>
          {/* Only show "Leave Review" button if you are the BUYER */}
          {amIBuyer && (
            <button
              style={reviewButtonStyle}
              onClick={() => setIsReviewModalOpen(true)}
            >
              Leave a Review
            </button>
          )}
        </div>
        {/* --- END NEW HEADER --- */}

        <div style={messagesAreaStyle}>
          {loading && <p>Loading history...</p>}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={msg.sender._id === userInfo._id ? myMessageStyle : otherMessageStyle}
            >
              <strong>{msg.sender._id === userInfo._id ? 'You' : msg.sender.name}: </strong>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form style={inputAreaStyle} onSubmit={sendMessage}>
          <input
            type="text"
            style={inputStyle}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>
            Send
          </button>
        </form>
      </div>

      {/* 4. --- RENDER THE MODAL (if open) --- */}
      {isReviewModalOpen && (
        <ReviewModal
          sellerId={sellerId}
          listingId={listingId}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </>
  );
};

export default ChatPage;