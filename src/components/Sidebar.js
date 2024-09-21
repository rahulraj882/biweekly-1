import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <ul>
        <li>Home</li>
        <li>Card View</li>
        <li>List View</li>
      </ul>
    </div>
  );
};

export default Sidebar;
