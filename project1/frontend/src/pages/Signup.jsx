import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', userType: 'buyer' });
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    if (name === 'password') {
      const hasNumberOrSpecialChar = /[0-9!@#$%^&*(),.?":{}|<>]/.test(value);
      const minLength = value.length >= 8;
      if (!hasNumberOrSpecialChar || !minLength) {
        setError('Password must be at least 8 characters long and include a number or special character');
      } else {
        setError('');
      }
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.name) {
      setError('Please enter a username, password, and name');
      return;
    }
    if (!error && newUser.password) {
      try {
        const response = await axios.post('http://localhost:8800/signup', newUser);
        if (response.status === 201) {
          setIsRegistered(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 409) {
          setError('Username already exists. Please choose a different username.');
        } else {
          console.error(err);
        }
      }
    }
  };

  const handleOkClick = () => {
    navigate('/home');
  };

  return (
    <div className="form-box"> {/* Updated class name to match the style used in SellCar */}
      <h1>Signup</h1>
      {error && <p className="error">{error}</p>}
      {!isRegistered ? (
        <>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={newUser.username}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={newUser.name}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Signup</button>
          <p>
            Already have an Account? <Link to="/home">click here</Link>
          </p>
        </>
      ) : (
        <>
          <p>Successfully registered</p>
          <button onClick={handleOkClick}>OK</button>
        </>
      )}
    </div>
  );
};

export default Signup;
