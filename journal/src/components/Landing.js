import React, { useState } from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import JournalList from './JournalList';
import Calendar from './Calendar';
import Notepad from './Notepad';
import './Landing.css';

const Landing = () => {
  const [activeComponent, setActiveComponent] = useState('chat'); // Default to 'chat'
  const [isToggleOn, setIsToggleOn] = useState(true); // Default to true (ON/Diary Mode)

  // Handle component switching from Navbar
  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  // Handle toggle switching between Chat and Notepad
  const handleToggle = () => {
    setIsToggleOn(!isToggleOn);
    setActiveComponent(isToggleOn ? 'new' : 'chat'); // If toggle is ON, switch to 'new', otherwise 'chat'
  };

  // Handle mode click from Navbar
  const handleModeClick = (mode) => {
    setActiveComponent(mode === 'diary' ? 'chat' : 'new');
  };

  return (
    <div className="main">
      <Navbar
        userName="Dia Grace"
        onNavClick={renderComponent}
        isToggleOn={isToggleOn}
        handleToggle={handleToggle}
        onModeClick={handleModeClick}
      />
      <div className="component-container">
        {activeComponent === 'chat' && <Chat />}
        {activeComponent === 'lists' && <JournalList />}
        {activeComponent === 'calendar' && <Calendar />}
        {activeComponent === 'new' && <Notepad />}
      </div>
    </div>
  );
};

export default Landing;