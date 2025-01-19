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
    <section className="bg-gray-50 dark:bg-gray-900 h-screen w-screen">

      <div className="flex flex-col items-center justify-center px-6 py-2 mx-auto md:h-screen lg:py-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <main className="max-w-7xl mx-auto py-6 px-4">
          <Clock/>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome to Clocked in</h1>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Track time effortlessly and boost your productivity.
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
