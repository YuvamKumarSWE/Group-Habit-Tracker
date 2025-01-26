import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Button } from '@/components/ui/button';
import TypingAnimation from './ui/typing-animation';
import AnimatedShinyText from './ui/animated-shiny-text';

const LandingPage = () => {
    const navigate = useNavigate(); // useNavigate hook for navigation

    const handleSubmit = (e) => {
          navigate("/SignIn"); // Redirect to dashboard
    };

  return (
    <section className="bg-gradient-to-r from-violet-200 to-pink-200 h-screen w-screen flex">

     

      {/* Right half - Text */}
      <div className=" flex flex-col items-center justify-center px-6 py-2 mx-auto md:h-screen lg:py-0 mt-[-4%]">
        <div className="p-6 space-y-6 sm:p-8 text-center">
          <main className="max-w-7xl mx-auto py-6 px-4">
            <h1 className=" font-semibold text-darkText mb-4">
               <TypingAnimation className="md:text-6xl text-4xl">Welcome to Clocked in </TypingAnimation> 
              </h1>
            <p className="md:text-3xl text-xs font-light text-customPurple dark:text-customPurple mb-6">
            Team Up, Track Together, Keep the Streak Alive!
            </p>
            <Button onClick={handleSubmit} className='bg-purple-300 md:text-xl'>
              <AnimatedShinyText shimmerWidth={40} >
                Get Started
              </AnimatedShinyText>
              
            </Button>
          </main>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
