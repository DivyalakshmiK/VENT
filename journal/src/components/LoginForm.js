import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // For navigation
import './LoginForm.css';

const LoginForm = ({ onClose, onSuccessfulLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // React router hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/sign-in', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);  // Save the token
      setMessage('Login successful!');
      
      navigate('/landing');  // Navigate to Chat component
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Invalid login credentials');
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-form">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
