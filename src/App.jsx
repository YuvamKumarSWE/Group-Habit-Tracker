import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import DashboardPage from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import SignInForm from "./components/Authentication/SignInForm";
import GroupDetails from "./GroupDetails";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen scroll-smooth overflow-hidden">
        <nav className="flex space-x-4 justify-between bg-gradient-to-r from-violet-200 to-pink-200 text-customPurple p-4">
          <Link to="/" className="font-obitron font-bold text-xl">
            Clocked In
          </Link>
          <div className="flex space-x-4">
            {user ? (
              <>
                <Link
                  to="/Dashboard"
                  className="font-obitron font-semibold hover:text-gray-400 pt-[2px]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="font-obitron font-semibold hover:text-gray-400"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/SignIn"
                className="font-obitron font-semibold hover:text-gray-400"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/SignIn"
            element={
              user ? <Navigate to="/Dashboard" /> : <SignInForm />
            }
          />
          <Route
            path="/Dashboard"
            element={
              user ? <DashboardPage /> : <Navigate to="/SignIn" />
            }
          />
          <Route
            path="/group/:groupId"
            element={
              user ? <GroupDetails /> : <Navigate to="/SignIn" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;