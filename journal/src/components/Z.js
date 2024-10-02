import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './Home.css';

const Home = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  return (
    <div className="home">
      <div className="background-image">
        {/* Replace with your desired background image */}
        <img src="path/to/your/background.jpg" alt="Background" />
      </div>

      <div className="content-wrapper">
        <motion.div
          className="promo-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Capture Your Journey, One Entry at a Time</h1>
          <p>
            Your thoughts matter. Start journaling today and discover the power of reflection.
            Whether it's your daily experiences, dreams, or goals, this journal is your personal space.
          </p>
          <div className="auth-options">
            <button className="auth-btn" onClick={handleSignInClick}>
              Sign In
            </button>
            <button className="auth-btn" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </motion.div>
      </div>

      {showSignIn && <LoginForm onClose={() => setShowSignIn(false)} />}
      {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}
    </div>
  );
};

export default Home;