// client/src/components/ProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Get the user's login status from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // 2. Check if the user is logged in
  if (userInfo) {
    // If logged in, show the child page (using <Outlet />)
    return <Outlet />;
  } else {
    // If not logged in, redirect them to the /login page
    // The 'replace' prop is important for correct browser history
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;