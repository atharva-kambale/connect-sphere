// client/pages/ChatPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from '../socket.js';
import axios from 'axios';
import ReviewModal from '../components/ReviewModal.jsx';

const ChatPage = () => {
  const { listingId, buyerId, sellerId } = useParams();
  const roomName = [buyerId, sellerId].sort().join('_') + `_${listingId}`;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingTitle, setListingTitle] = useState('Loading...');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const amIBuyer = userInfo._id === buyerId;

  // Fetch History and Join Room
  useEffect(() => {
    if (!roomName || !userInfo) return;
    const setupChat = async () => {
      setLoading(true);
      try {
        const { data: listingData } = await axios.get(`/api/listings/${listingId}`);
        setListingTitle(listingData.title);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data: messagesData } = await axios.get(`/api/messages/${roomName}`, config);
        setMessages(messagesData);
      } catch (err) {
        console.error('Failed to fetch chat data', err);
      } finally {
        setLoading(false);
      }
    };
    socket.emit('join_room', roomName);
    setupChat();
  }, [roomName, userInfo, listingId]);

  // Listen for Messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const incomingMessage = {
        content: data.message,
        sender: { _id: data.senderId, name: data.senderName }, // Use senderName here too
      };
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };
    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  // --- THIS IS THE FIX ---
  // Send Message
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && userInfo && roomName) {
      const messageData = {
        room: roomName,
        message: message.trim(),
        senderName: userInfo.name, // The key is now 'senderName'
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
  // --- END OF FIX ---

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 pt-24">
        {/* Main chat container */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden 
                        flex flex-col h-[75vh] dark:bg-gray-800 dark:border-gray-700">
          
          {/* Chat Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center
                          dark:bg-gray-700 dark:border-gray-600">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">{listingTitle}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Private Chat</p>
            </div>
            {amIBuyer && (
              <button
                className="bg-yellow-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold 
                           hover:bg-yellow-600 transition shadow"
                onClick={() => setIsReviewModalOpen(true)}
              >
                Leave a Review
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-100 dark:bg-gray-900">
            {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading history...</p>}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender._id === userInfo._id ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow ${
                    msg.sender._id === userInfo._id
                      ? 'bg-blue-600 text-white rounded-br-lg'
                      : 'bg-white text-gray-800 border dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-bl-lg'
                  }`}
                >
                  <strong className="block text-sm">
                    {msg.sender._id === userInfo._id ? 'You' : msg.sender.name}
                  </strong>
                  <p className="text-md">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Form */}
          <form className="p-4 bg-white border-t border-gray-200 flex space-x-3
                           dark:bg-gray-800 dark:border-gray-700" 
                onSubmit={sendMessage}>
            <input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-lg 
                         focus:ring-4 focus:ring-blue-200
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold 
                         hover:bg-blue-700 transition duration-150 shadow-md"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
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