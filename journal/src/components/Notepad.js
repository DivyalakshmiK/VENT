import React, { useState } from 'react';
import axios from 'axios';
import './Notepad.css'; // Make sure this points to the new CSS file

const Notepad = () => {
  const [content, setContent] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [mood, setMood] = useState('');

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/save-entry', 
        { content, mood },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAlertMessage('Your thoughts have been saved.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error saving entry:', error);
      setAlertMessage('Unable to save. Please try again when you\'re ready.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  return (
    <div className="vent-container">
      <div className="vent-space">
        <div className="vent-header">Safe Space</div>
        <div className="vent-content">
          <textarea
            className="vent-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="This is a safe space. Share your thoughts..."
          ></textarea>
        </div>
        <div className="vent-footer">
          <div className="mood-selector">
            <span className={`mood-icon ${mood === '😤' ? 'selected' : ''}`} onClick={() => handleMoodSelect('😤')}>😤</span>
            <span className={`mood-icon ${mood === '😔' ? 'selected' : ''}`} onClick={() => handleMoodSelect('😔')}>😔</span>
            <span className={`mood-icon ${mood === '😐' ? 'selected' : ''}`} onClick={() => handleMoodSelect('😐')}>😐</span>
            <span className={`mood-icon ${mood === '😌' ? 'selected' : ''}`} onClick={() => handleMoodSelect('😌')}>😌</span>
          </div>
          <button onClick={handleSave} className="vent-save-btn">Save entry</button>
        </div>
      </div>
      {showAlert && (
        <div className="alert">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Notepad;