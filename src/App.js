import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import WeekScreen from './screens/WeekScreen';
import DayScreen from './screens/DayScreen';
import ChoiceScreen from './screens/ChoiceScreen';
import CheckInOutScreen from './screens/CheckInOutScreen';
import RosterScreen from './screens/RosterScreen';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    if (username === 'BestCamp' && password === '1665') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <Router>
        
         
            <RosterScreen onLogin={handleLogin} />
          
        
      </Router>
    </div>
  );
};

export default App;
