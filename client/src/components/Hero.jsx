// client/src/components/Hero.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const heroImageUrl = "https://images.unsplash.com/photo-1524678606370-a47625cb810c?q=80&w=1769&auto=format&fit=crop";

const Hero = () => {
  return (
    // We use a relative container for the overlay
    <div 
      className="relative w-full h-80 rounded-xl overflow-hidden mb-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Welcome to the Marketplace
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6">
          Find what you need, sell what you don't.
        </p>
        <Link
          to="/create-listing"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Sell Your Stuff
        </Link>
      </div>
    </div>
  );
};

// --- THIS IS THE FIX ---
// Make sure this line is at the bottom of your file
export default Hero;