import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';
const Sellerlogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };
  const handleCloseClick = () => {
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8800/login/seller', credentials);
      console.log(response.data);
      navigate('/Sellerview');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials');
      } else {
        console.error(err);
      }
    }
  };


  const handleSignUp = () => {
    navigate('/SellerSignup');
  };

  return (
    <div className="form-box">
      <span className="close-button" onClick={handleCloseClick}>&times; </span>
      <h1>Seller Login</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        name="username"
        value={credentials.username}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Login</button>
      <p>
    Don't have an account?{' '}
    <Link to="/SellerSignup" onClick={handleSignUp}>
      Sign Up
    </Link>
  </p>
    </div>
  );
};
export default Sellerlogin;
