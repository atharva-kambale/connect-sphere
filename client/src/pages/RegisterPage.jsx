// client/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';
import { setCredentials } from '../store/slices/authSlice.js';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('/api/users', {
        name,
        email,
        password,
        university,
      });
      
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center
                     dark:text-white">
        Create Account
      </h1>
      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        
        {/* Name Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-4 focus:ring-blue-200 
                       transition duration-150
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-4 focus:ring-blue-200 
                       transition duration-150
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* University Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="university" className="font-medium text-gray-700 dark:text-gray-300">University</label>
          <input
            type="text"
            id="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-4 focus:ring-blue-200 
                       transition duration-150
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-4 focus:ring-blue-200 
                       transition duration-150
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="confirmPassword" className="font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-4 focus:ring-blue-200 
                       transition duration-150
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-green-600 text-white p-3.5 rounded-lg text-lg font-semibold 
                     hover:bg-green-700 transition duration-150 shadow-md"
        >
          Register
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center text-sm dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold dark:text-blue-400 dark:hover:text-blue-300">
          Login
        </Link>
      </div>
    </FormContainer>
  );
};

export default RegisterPage;