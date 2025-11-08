// client/src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer.jsx'; // Our new component
import { setCredentials } from '../store/slices/authSlice.js'; // Our Redux action

// Basic inline styles for the form
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
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

// --- The Main Component ---
const LoginPage = () => {
  // 1. Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For login errors

  // 2. Redux and Router hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 3. Get user info from Redux state
  const { userInfo } = useSelector((state) => state.auth);

  // 4. Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/'); // Redirect to homepage
    }
  }, [navigate, userInfo]);

  // 5. Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    setError(null); // Clear previous errors

    try {
      // 6. Call our backend API
      const res = await axios.post('/api/users/login', { email, password });
      
      // 7. 'res.data' is the user object with the token
      // We dispatch our 'setCredentials' action to update the global state
      dispatch(setCredentials(res.data));
      
      // 8. Redirect to the homepage
      navigate('/');
    } catch (err) {
      // 'err.response.data.message' is the error from our backend
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler} style={formStyle}>
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

        {/* Show error message if login fails */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={buttonStyle}>
          Sign In
        </button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        New Customer?{' '}
        <Link to="/register" style={{ color: '#007bff' }}>
          Register
        </Link>
      </div>
    </FormContainer>
  );
};

export default LoginPage;