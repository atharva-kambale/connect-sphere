// client/src/App.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'; // 1. Import your new Navbar

const App = () => {
  return (
    <>
      <Navbar /> {/* 2. Add the Navbar here, above the page content */}
      <main style={{ padding: '20px' }}>
        <Outlet /> {/* 3. The current page will be rendered here */}
      </main>
    </>
  );
};

export default App;