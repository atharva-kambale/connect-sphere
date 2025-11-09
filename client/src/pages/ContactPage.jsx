// client/pages/ContactPage.jsx

import React, { useState } from 'react';

const ContactPage = () => {
  const [status, setStatus] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend API endpoint.
    // For now, we simulate success.
    setStatus('success');
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b pb-4 text-center">Contact Our Team</h1>
      
      <p className="text-gray-600 mb-6 text-center">
        Have questions about your listing, a bug report, or feature suggestions? Send us a message!
      </p>

      {status === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
          Message sent successfully! We will get back to you soon.
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-medium text-gray-700">Your Name</label>
          <input type="text" id="name" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-medium text-gray-700">Your Email</label>
          <input type="email" id="email" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <div className="flex flex-col space-y-1">
          <label htmlFor="message" className="font-medium text-gray-700">Message</label>
          <textarea id="message" rows="5" required className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-150 shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;