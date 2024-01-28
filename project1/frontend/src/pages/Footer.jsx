// Footer.jsx
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <FaFacebook className="icon" />
        <FaTwitter className="icon" />
        <FaInstagram className="icon" />
      </div>
      <p>Copyright © 2024 VroomVersatile. All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
