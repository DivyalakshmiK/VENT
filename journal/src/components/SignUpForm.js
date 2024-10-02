import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css';

const SignUpForm = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/sign-up', {
        username,
        email,
        password,
      });
      setMessage('User signed up successfully!');
      onClose(); // Close modal after successful signup
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Error signing up');
    }
  };

  return (
    <div className="signup-modal-overlay">
      <div className="signup-form">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
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
          <button type="submit" className="submit-btn">Sign Up</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
