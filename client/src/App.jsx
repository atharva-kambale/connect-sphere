// client/src/App.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx'; // 1. Import Footer

const App = () => {
  return (
    // Apply min-h-screen to ensure footer is at the bottom
    <div className="min-h-screen flex flex-col bg-gray-50"> 
      <Navbar />
      
      {/* 2. Main content area - flex-grow ensures it takes all available space */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full"> 
        <Outlet />
      </main>
      
      {/* 3. Add the Footer */}
      <Footer />
    </div>
  );
};

export default App;