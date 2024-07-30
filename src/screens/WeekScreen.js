import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './WeekScreen.css'; // Import the CSS file for styles

const weeks = [
  'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5',
  'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10'
];

const WeekScreen = ({ setIsLoggedIn }) => {
  const navigate = useNavigate(); // Use the navigate function from React Router

  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false
    navigate('/login'); // Navigate to the login screen
  };

  return (
    <div className="container">
      <div className="listContainer">
        {weeks.map((week, index) => (
          <div key={index} className="buttonContainer">
            <button
              className="button"
              onClick={() => navigate('/day', { state: { week } })}
            >
              {week}
            </button>
          </div>
        ))}
      </div>
      <button className="logoutButton" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default WeekScreen;
