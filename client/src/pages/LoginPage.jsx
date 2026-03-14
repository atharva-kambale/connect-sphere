import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import FormContainer from '../components/FormContainer.jsx';
import { setCredentials } from '../store/slices/authSlice.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isOtpMode, setIsOtpMode] = useState(false); // Toggle between Password and OTP
  const [otpSent, setOtpSent] = useState(false); // Has the OTP been mailed?
  
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  // --- HANDLERS ---

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('/api/users/login', { email, password });
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleSendLoginOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      await axios.post('/api/users/login-otp-send', { email });
      setOtpSent(true);
      setMessage('Login code sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('/api/users/login-otp-verify', { email, otp });
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally { setLoading(false); }
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center dark:text-white">
        {isOtpMode ? 'OTP Login' : 'Sign In'}
      </h1>

      {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4 text-center">{message}</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 text-center">{error}</p>}

      {!isOtpMode ? (
        /* --- PASSWORD LOGIN FORM --- */
        <form onSubmit={handlePasswordLogin} className="flex flex-col space-y-4">
          <input 
            type="email" placeholder="Email" value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" required 
          />
          <input 
            type="password" placeholder="Password" value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" required 
          />
          
          <div className="text-right">
            <Link to="/forgot-password" size="sm" className="text-xs text-blue-600 hover:underline">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        /* --- OTP LOGIN FORM --- */
        <div className="flex flex-col space-y-4">
          <input 
            type="email" placeholder="Enter your registered email" value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" disabled={otpSent} 
          />
          
          {!otpSent ? (
            <button onClick={handleSendLoginOtp} disabled={loading || !email} className="bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700">
              {loading ? 'Sending...' : 'Send Login Code'}
            </button>
          ) : (
            <form onSubmit={handleVerifyLoginOtp} className="flex flex-col space-y-4">
              <input 
                type="text" placeholder="6-Digit Code" value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                className="p-3 border rounded-lg text-center tracking-widest font-bold dark:bg-gray-700 dark:text-white" required 
              />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
                Verify & Login
              </button>
            </form>
          )}
        </div>
      )}

      <hr className="my-6 border-gray-300 dark:border-gray-600" />

      <button 
        onClick={() => { setIsOtpMode(!isOtpMode); setOtpSent(false); setError(null); }}
        className="w-full text-sm font-medium text-gray-500 hover:text-blue-600 transition"
      >
        {isOtpMode ? 'Use Password instead' : 'Login using Email OTP'}
      </button>

      <div className="mt-6 text-center text-sm dark:text-gray-400">
        New to Connect Sphere? <Link to="/register" className="text-blue-600 font-bold">Sign Up</Link>
      </div>
    </FormContainer>
  );
};

export default LoginPage;