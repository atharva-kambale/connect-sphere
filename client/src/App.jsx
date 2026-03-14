// client/src/App.jsx

import React from 'react';
import { Outlet, useLocation }from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

const App = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    // We set the base background color here.
    // On the landing page, the 'bg-gray-50' won't be visible
    // because the hero section covers it.
    <div className={`flex flex-col min-h-screen ${!isLandingPage ? 'bg-gray-50 dark:bg-gray-900' : 'dark:bg-gray-900'}`}> 
      <Navbar />
      
      {/* THIS IS THE FIX:
        'pt-20' is REMOVED. The child pages will handle their own padding.
      */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;