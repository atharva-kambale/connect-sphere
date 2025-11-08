// client/src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx';
import { setCredentials } from '../store/slices/authSlice.js';

// --- (Styles are the same as LoginPage) ---
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};
const inputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
};
const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '4px',
  background: '#28a745', // Green for register
  color: 'white',
  cursor: 'pointer',
};
// --- (End of styles) ---

const RegisterPage = () => {
  // 1. Form state (more fields)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // For errors

  // 2. Redux and Router hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // 3. Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/'); // Redirect to homepage
    }
  }, [navigate, userInfo]);

  // 4. Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    // 5. Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Stop the submission
    }

    try {
      // 6. Call our backend registration API
      const res = await axios.post('/api/users', {
        name,
        email,
        password,
        university,
      });
      
      // 7. Dispatch 'setCredentials' to log the new user in
      dispatch(setCredentials(res.data));
      
      // 8. Redirect to the homepage
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler} style={formStyle}>
        {/* Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* University */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="university">University</label>
          <input
            type="text"
            id="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Confirm Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Show error message if registration fails */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={buttonStyle}>
          Register
        </button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#007bff' }}>
          Login
        </Link>
      </div>
    </FormContainer>
  );
};

export default RegisterPage;