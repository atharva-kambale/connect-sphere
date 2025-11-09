// client/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Tailwind: bg-gray-900 (dark background), text-white (white text), padding
    <footer className="bg-gray-900 text-white mt-12 py-8 border-t border-blue-600">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Logo/Mission */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">Connect Sphere</h3>
            <p className="text-sm text-gray-400">
              Your hyperlocal, cost-free marketplace built for the university community. Buy and sell with trust.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-300 mb-4">Market</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/inbox" className="text-gray-400 hover:text-blue-400 transition">Inbox</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-blue-400 transition">My Listings</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-lg font-semibold text-gray-300 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {/* New About Us link */}
              <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition">About Us</Link></li>
              {/* New Contact Us link */}
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 transition">Contact Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Contact/Social (Placeholder) */}
          <div>
            <h4 className="text-lg font-semibold text-gray-300 mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">🔗</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">📸</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">💻</a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-700">
          &copy; {currentYear} Connect Sphere. All rights reserved. Built by Atharva Kambale.
        </div>
      </div>
    </footer>
  );
};

export default Footer;