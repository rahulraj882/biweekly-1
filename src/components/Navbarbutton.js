import React from 'react';
import './NavbarButton.css';

const NavbarButton = ({ onClick }) => {
  return (
    <button className="navbar-button" onClick={onClick}>
      &#9776;
    </button>
  );
};

export default NavbarButton;
