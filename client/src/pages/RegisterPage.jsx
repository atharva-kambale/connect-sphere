// client/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';
import { setCredentials } from '../store/slices/authSlice.js';

const RegisterPage = () => {
  // --- Form States ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // --- NEW: OTP States ---
  const [step, setStep] = useState(1); // 1 = Details form, 2 = OTP form
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState(''); // To remember who is verifying
  
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  // --- STEP 1: Submit Details ---
  const submitDetailsHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // 1. Send data to backend (Backend will now send an email instead of a token)
      const res = await axios.post('/api/users', {
        name,
        email,
        password,
        university,
      });
      
      // 2. Save the email they used, show success message, and flip to Step 2!
      setRegisteredEmail(res.data.email || email);
      setMessage(res.data.message);
      setStep(2);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    }
  };

  // --- STEP 2: Submit OTP ---
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Send the OTP and Email to our new verification route
      const res = await axios.post('/api/users/verify-otp', {
        email: registeredEmail,
        otp: otp.trim(),
      });
      
      // 2. The backend verified them! Now we log them in using your Redux action
      dispatch(setCredentials(res.data));
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Verification Failed. Please check your code.');
    }
  };

  // ==========================================
  // RENDER STEP 2: THE OTP VERIFICATION SCREEN
  // ==========================================
  if (step === 2) {
    return (
      <FormContainer>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center dark:text-white">
          Verify Your Email
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          We sent a 6-digit code to <strong className="text-blue-600 dark:text-blue-400">{registeredEmail}</strong>. 
          It will expire in 10 minutes.
        </p>

        {message && <p className="text-green-600 text-sm font-semibold mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm font-semibold mb-4 text-center">{error}</p>}

        <form onSubmit={verifyOtpHandler} className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1 text-center">
            <label htmlFor="otp" className="font-medium text-gray-700 dark:text-gray-300">Enter 6-Digit Code</label>
            <input
              type="text"
              id="otp"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="p-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-bold
                         focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 text-white p-3.5 rounded-lg text-lg font-semibold 
                       hover:bg-blue-700 transition duration-150 shadow-md"
          >
            Verify & Log In
          </button>
        </form>
      </FormContainer>
    );
  }

  // ==========================================
  // RENDER STEP 1: THE REGISTRATION FORM
  // ==========================================
  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center dark:text-white">
        Create Account
      </h1>
      <form onSubmit={submitDetailsHandler} className="flex flex-col space-y-4">
        
        {/* Name Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text" id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">University Email Address</label>
          <input
            type="email" id="email" value={email} placeholder="e.g., student@sitrc.ac.in"
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* University Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="university" className="font-medium text-gray-700 dark:text-gray-300">University</label>
          <input
            type="text" id="university" value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="confirmPassword" className="font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input
            type="password" id="confirmPassword" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-green-600 text-white p-3.5 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-150 shadow-md"
        >
          Sign Up
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