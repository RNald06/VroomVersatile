import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <h1>VroomVersatile</h1>
      <nav>
        <div className="dropdown">
          <button className="dropbtn">About Us</button>
          <div className="dropdown-content">
            <Link to="/about">About VroomVersatile </Link><br/>
            <Link to="/reviewlist">Customer Review</Link><br/>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
