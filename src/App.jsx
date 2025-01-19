import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignIn from './components/SignIn'; // Import the SignIn component
import GalleryAndStreak from './components/GalleryAndStreak';

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
      <div className="max-h-[100vh] scroll-behavior: smooth overflow-hidden">
        {/* Navigation Links */}
        <nav className="flex space-x-4 justify-between bg-black text-white p-4">
          <Link
            to={isLoggedIn ? "/DashBoard" : "#"}
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                setShowAlert(true); // Show the alert modal
              }
            }}
            className={`hover:${isLoggedIn ? 'text-gray-300' : 'cursor-not-allowed text-gray-500'}`}
          >
            DashBoard
          </Link>
          <Link
            to="/"
            onClick={handleLogout} // Log out when clicking "Sign Out"
            className="hover:text-gray-600"
          >
            Sign Out
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/DashBoard" element={<GalleryAndStreak />} />
        </Routes>

        {/* Alert Modal */}
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md text-center">
              <div className="mb-4">
                <iframe
                  src="https://tenor.com/embed/5519036"
                  width="500"
                  height="200"
                  frameBorder="0"
                  allowFullScreen
                  title="Youre Dumb GIF"
                ></iframe>
              </div>
              <p className="text-lg font-bold">Please sign up or log in to access the Dashboard!</p>
              <button
                onClick={closeAlert}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;