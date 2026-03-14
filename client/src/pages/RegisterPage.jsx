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
  
  // Step 1 = Signup Form, Step 2 = OTP Input
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  // STEP 1: Handle Initial Registration
  const submitDetailsHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/users', { name, email, password, university });
      setRegisteredEmail(email);
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Handle OTP Verification
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post('/api/users/verify-otp', {
        email: registeredEmail,
        otp: otp.trim(),
      });
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Bonus: Handle Resending the OTP
  const resendOtpHandler = async () => {
    setError(null);
    setMessage('Resending code...');
    try {
      await axios.post('/api/users', { name, email: registeredEmail, password, university });
      setMessage('A new code has been sent!');
    } catch (err) {
      setError('Failed to resend code.');
    }
  };

  // --- UI: OTP VERIFICATION SCREEN ---
  if (step === 2) {
    return (
      <FormContainer>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center dark:text-white">Verify Your Email</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Code sent to <strong className="text-blue-600">{registeredEmail}</strong>
        </p>

        {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4 text-center">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={verifyOtpHandler} className="flex flex-col space-y-4">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            className="p-4 border border-gray-300 rounded-xl text-center text-3xl tracking-[1rem] font-black focus:ring-4 focus:ring-blue-200 dark:bg-gray-700 dark:text-white"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Log In'}
          </button>
        </form>

        <button onClick={resendOtpHandler} className="w-full mt-4 text-sm text-gray-500 hover:text-blue-600 transition">
          Didn't get a code? <span className="font-bold underline">Resend Code</span>
        </button>
      </FormContainer>
    );
  }

  // --- UI: REGISTRATION FORM ---
  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center dark:text-white">Create Account</h1>
      <form onSubmit={submitDetailsHandler} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 dark:text-gray-300">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" required />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 dark:text-gray-300">University Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" placeholder="student@sitrc.ac.in" required />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 dark:text-gray-300">University Name</label>
          <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 dark:text-gray-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" required />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 dark:text-gray-300">Confirm</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" required />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

        <button type="submit" disabled={loading} className="bg-green-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-green-700 transition shadow-lg">
          {loading ? 'Sending Code...' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
      </div>
    </FormContainer>
  );
};

export default RegisterPage;