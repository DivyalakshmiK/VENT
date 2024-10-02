import React, { useState } from 'react';
import { FaUserCircle, FaList, FaCalendarAlt } from 'react-icons/fa';
import './Navbar.css';
import VENT from '../assets/VENT logo.jpg';

const Navbar = ({ userName, onNavClick, isToggleOn, handleToggle, onModeClick }) => {
  const [activeItem, setActiveItem] = useState('');

  const handleModeClick = () => {
    onModeClick(isToggleOn ? 'diary' : 'notes');
    setActiveItem('');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">
          <img src={VENT} alt="VENT Logo" className="vent-logo" />
          <span className="vent-text">VENT</span>
        </a>
      </div>
      <ul className="nav-links">
        <li className="toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={isToggleOn}
              onChange={handleToggle}
            />
            <span className="slider">
              <span className="slider-icon">🖋️</span>
              <span className="slider-icon">📝</span>
            </span>
          </label>
          <span className="mode-label" onClick={handleModeClick}>
            {isToggleOn ? 'Diary Mode' : 'Notes Mode'}
          </span>
        </li>
        <li
          className={`nav-item ${activeItem === 'lists' ? 'active' : ''}`}
          onClick={() => { onNavClick('lists'); setActiveItem('lists'); }}
        >
          <FaList />
          <span>Lists</span>
        </li>
        <li
          className={`nav-item ${activeItem === 'calendar' ? 'active' : ''}`}
          onClick={() => { onNavClick('calendar'); setActiveItem('calendar'); }}
        >
          <FaCalendarAlt />
          <span>Calendar</span>
        </li>
        <li className="user-info">
          <FaUserCircle />
          <span className="username">{userName}</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;