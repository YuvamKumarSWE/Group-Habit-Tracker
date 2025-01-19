import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignIn from './components/SignIn'; // Import the SignIn component
import GalleryAndStreak from './components/GalleryAndStreak';

const App = () => {
  return (
    <Router>
      <div className='max-h-[100vh] scroll-behavior: smooth overflow-hidden'>
        {/* Navigation Links */}
        <nav className='flex space-x-4 justify-between bg-black text-white p-4'>
          <Link to="/DashBoard" className='hover:text-gray-300'>DashBoard</Link>
          <Link to="/" className='hover:text-gray-600' >Sign Out</Link>
          
          
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/DashBoard" element={<GalleryAndStreak />} />
         
        </Routes>
      </div>
    </Router>
  );
};



export default App;