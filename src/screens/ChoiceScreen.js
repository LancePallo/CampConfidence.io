import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChoiceScreen.css'; // Import the CSS file

const choices = ['Check In/Out', 'Staff'];

const ChoiceScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { week, day } = location.state || {}; // Access parameters from location.state

  const handleNavigation = (choice) => {
    if (choice === 'Check In/Out') {
      navigate('/check-in-out', { state: { week, day } });
    } else if (choice === 'Staff') {
      navigate('/roster', { state: { week, day } });
    }
  };

  return (
    <div className="container">
      <h1 className="text">{`${week} - ${day}`}</h1>
      <div className="buttonsContainer">
        {choices.map(choice => (
          <button
            key={choice}
            className="button"
            onClick={() => handleNavigation(choice)}
          >
            <span className="buttonText">{choice}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceScreen;
