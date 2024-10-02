import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './Home.css';

const Home = ({ onLogin }) => {
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

  const handleSuccessfulLogin = () => {
    onLogin();
    setShowSignIn(false);
  };

  return (
    <div className="home">
      <div className="background-gradient"></div>
      <div className="floating-shapes">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className={`shape shape${index + 1}`}
            animate={{
              y: ["0%", "-20%", "0%", "20%", "0%"],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              delay: index * 2,
            }}
          />
        ))}
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
            <motion.button
              className="auth-btn"
              onClick={handleSignInClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <motion.button
              className="auth-btn"
              onClick={handleSignUpClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      </div>
      {showSignIn && <LoginForm onClose={() => setShowSignIn(false)} onSuccessfulLogin={handleSuccessfulLogin} />}
      {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}
    </div>
  );
};

export default Home;