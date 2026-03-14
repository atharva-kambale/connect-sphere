// client/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
// 1. Import the icons
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to an API.
    // For now, we'll just show an alert.
    alert('Thank you for subscribing!');
  };

  return (
    // Main footer container
    <footer className="bg-gray-900 text-gray-400 dark:bg-gray-900 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Top section: Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Column 1: Brand (takes 2 spans) */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Connect Sphere</h3>
            <p className="text-sm text-gray-400 mb-4">
              The hyperlocal, cost-free marketplace built for the university community. Buy and sell with trust.
            </p>
          </div>

          {/* Column 2: Market */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-4">Market</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/market" className="hover:text-blue-400 transition">Browse All</Link></li>
              <li><Link to="/profile" className="hover:text-blue-400 transition">My Profile</Link></li>
              <li><Link to="/create-listing" className="hover:text-blue-400 transition">Sell an Item</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-4">Join our Newsletter</h4>
            <p className="text-sm mb-3">Get updates on new features and popular items.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input 
                type="email" 
                placeholder="your-email@school.edu" 
                className="w-full px-3 py-2 text-gray-800 text-sm rounded-l-md focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 transition"
              >
                Go
              </button>
            </form>
          </div>

        </div>
        
        {/* Bottom section: Copyright and Socials */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} Connect Sphere. All rights reserved. Built by Atharva Kambale.
          </p>
          <div className="flex space-x-5 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition" aria-label="Twitter"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-white transition" aria-label="Instagram"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-white transition" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
            <a href="#" className="hover:text-white transition" aria-label="GitHub"><FaGithub size={20} /></a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;