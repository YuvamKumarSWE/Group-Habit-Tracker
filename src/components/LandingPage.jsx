import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Button } from '@/components/ui/button';
import Clock from './Clock';

const LandingPage = () => {
    const navigate = useNavigate(); // useNavigate hook for navigation

    const handleSubmit = (e) => {
          navigate("/SignIn"); // Redirect to dashboard
    };

  return (
    <section className="bg-gradient-to-r bg-gradient-to-r from-violet-200 to-pink-200 h-screen w-screen flex">

      {/* Left half - Clock */}
      <div className="w-1/2 flex justify-center items-center dark:bg-gray-800">
        <Clock />
      </div>

      {/* Right half - Text */}
      <div className="w-1/2 flex flex-col items-center justify-center px-6 py-2 mx-auto md:h-screen lg:py-0">
        <div className="p-6 space-y-6 sm:p-8 text-center">
          <main className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-4xl font-semibold text-darkText mb-4">Welcome to Clocked in</h1>
            <p className="text-2xl font-light text-customPurple dark:text-customPurple mb-6">
            Team Up, Track Together, Keep the Streak Alive!
            </p>
            <Button onClick={handleSubmit}>
              Get Started
            </Button>
          </main>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
