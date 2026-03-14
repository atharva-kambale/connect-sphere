// client/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormContainer from '../components/FormContainer.jsx';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Reset Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // --- STEP 1: Request the Reset Code ---
  const requestResetHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post('/api/users/forgot-password', { email: email.trim().toLowerCase() });
      setMessage('A reset code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Email not found.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Reset the Password ---
  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/users/reset-password', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword
      });
      
      // Success! Send them to login
      alert('Password reset successful! Please log in with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center dark:text-white">
        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        {step === 1 
          ? "No worries! Enter your email and we'll send you a recovery code." 
          : `Enter the code sent to ${email} and your new password.`
        }
      </p>

      {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4 text-center font-medium">{message}</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 text-center font-medium">{error}</p>}

      {step === 1 ? (
        /* --- FORM: REQUEST CODE --- */
        <form onSubmit={requestResetHandler} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 dark:text-gray-300">University Email</label>
            <input 
              type="email" 
              placeholder="student@sitrc.ac.in" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Recovery Code'}
          </button>
        </form>
      ) : (
        /* --- FORM: RESET PASSWORD --- */
        <form onSubmit={resetPasswordHandler} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 dark:text-gray-300">6-Digit Code</label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="000000" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              className="p-3 border rounded-lg text-center tracking-widest font-bold dark:bg-gray-700 dark:text-white" 
              required 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 dark:text-gray-300">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" 
              required 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 dark:text-gray-300">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            {loading ? 'Resetting...' : 'Update Password'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm dark:text-gray-400">
        Remembered it? <Link to="/login" className="text-blue-600 font-bold hover:underline">Back to Login</Link>
      </div>
    </FormContainer>
  );
};

export default ForgotPasswordPage;