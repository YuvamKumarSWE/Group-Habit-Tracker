import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignIn from './components/SignIn'; // Import the SignIn component
import DashboardPage from './components/Dashboard';
import GalleryAndStreak from './components/GalleryAndStreak';
import LandingPage from './components/LandingPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const [showAlert, setShowAlert] = useState(false); // Control modal visibility

  const handleLogin = () => {
    setIsLoggedIn(true); // Update the state when the user logs in
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update the state when the user logs out
  };

  const closeAlert = () => {
    setShowAlert(false); // Close the modal
  };

  return (
    <Router>
      <div className="min-h-screen scroll-smooth overflow-hidden">
        {/* Navigation Links */}
        <nav className="flex space-x-4 justify-between bg-gradient-to-r bg-gradient-to-r from-violet-200 to-pink-200 text-customPurple p-4">
          <Link
            to={isLoggedIn ? "/Dashboard" : "#"}
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                setShowAlert(true); // Show the alert modal
              }
            }}
            className={`hover:${isLoggedIn ? 'text-customPurple' : 'cursor-not-allowed text-customPurple'}`}
          >
            DashBoard
          </Link>
          <Link
            to="/"
            onClick={handleLogout} // Log out when clicking "Sign Out"
            className="hover:text-gray-400"
          >
            Sign Out
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/SignIn" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/DashBoard" element={<DashboardPage />} />
          <Route path="/group/:id" element={<GalleryAndStreak/> }/>
        </Routes>

        {/* Alert Modal */}
        
          </div>
        
  
    </Router>
  );
};

export default App;