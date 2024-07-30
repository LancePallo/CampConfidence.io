import React, { useState } from 'react';
import './LoginScreen.css';
import background from '../assets/background.jpg';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="viewContainer">
      <div 
        className="background" 
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="container">
          <h1 className="HeaderText">Camp Confidence</h1>
          <h2 className="loginText">Login</h2>
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" onClick={() => onLogin(username, password)}>
            <span className="buttonText">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
