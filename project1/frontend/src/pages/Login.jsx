import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8800/login/buyer', credentials);
      console.log(response.data);
      navigate('/homepage');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials');
      } else {
        console.error(err);
      }
    }
  };

  const handleCloseClick = () => {
    window.location.reload();
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="form-box">
      <span className="close-button" onClick={handleCloseClick}>&times; </span>
  <h1>Login</h1>
  {error && (
    <ul>
      <li className="error">{error}</li>
    </ul>
  )}
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
    <Link to="/signup" onClick={handleSignUp}>
      Sign Up
    </Link>
  </p>
</div>

  );
};
export default Login;
