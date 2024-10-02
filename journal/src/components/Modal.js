import React from 'react';
import './Modal.css';
import { Link } from 'react-router-dom';

const Modal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Welcome! Choose an Option:</h2>
        <div className="modal-buttons">
          <Link to="/sign-in" className="modal-button">Sign In</Link>
          <Link to="/sign-up" className="modal-button">Sign Up</Link>
        </div>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default Modal;
