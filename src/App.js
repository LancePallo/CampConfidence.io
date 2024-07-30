import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
        <Switch>
          {isLoggedIn ? (
            <>
              <Route path="/week">
                <WeekScreen setIsLoggedIn={setIsLoggedIn} />
              </Route>
              <Route path="/day" component={DayScreen} />
              <Route path="/choice" component={ChoiceScreen} />
              <Route path="/check-in-out" component={CheckInOutScreen} />
              <Route path="/roster" component={RosterScreen} />
              <Redirect from="/" to="/week" />
            </>
          ) : (
            <Route path="/">
              <LoginScreen onLogin={handleLogin} />
            </Route>
          )}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
