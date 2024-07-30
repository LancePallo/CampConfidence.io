import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DayScreen.css'; // Import the CSS file for styling

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DayScreen = () => {
  const { week } = useParams(); // Get week from URL parameters
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleButtonClick = (day) => {
    navigate('/choice-screen', { state: { week, day } }); // Navigate to ChoiceScreen with state
  };

  return (
    <div className="container">
      <h1 className="text">{week}</h1>
      <div className="buttonsContainer">
        {days.map(day => (
          <button
            key={day}
            className="button"
            onClick={() => handleButtonClick(day)}
          >
            <span className="buttonText">{day}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayScreen;
