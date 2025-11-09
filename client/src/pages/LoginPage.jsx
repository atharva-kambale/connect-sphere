// client/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';
import { setCredentials } from '../store/slices/authSlice.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('/api/users/login', { email, password });
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed'); 
    }
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Sign In</h1>
      <form onSubmit={submitHandler} className="flex flex-col space-y-5">
        
        {/* Email Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-blue-600 text-white p-3.5 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-150 shadow-md"
        >
          Sign In
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center text-sm">
        New Customer?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold">
          Register
        </Link>
      </div>
    </FormContainer>
  );
};

export default LoginPage;