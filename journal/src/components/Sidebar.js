import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><button>Daily Prompt</button></li>
        <li><button>Favourites</button></li>
        <li><button>Trash</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
