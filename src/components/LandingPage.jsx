import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button';
import TypingAnimation from './ui/typing-animation';
import AnimatedShinyText from './ui/animated-shiny-text';
import { useState } from 'react';

const LandingPage = () => {
    const navigate = useNavigate(); // useNavigate hook for navigation
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = () => {
          navigate("/SignIn"); // Redirect to dashboard
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

  return (
    <section className="bg-gradient-to-r from-violet-200 to-pink-200 h-screen w-screen flex">
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
                Get Started!
              </AnimatedShinyText> 
            </Button>
            <p>
            <button onClick={toggleModal} className="underline text-sm mt-2">
                Learn More
            </button>
            </p>
            
          </main>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg max-w-lg mx-auto shadow-lg transform transition-all duration-300 ease-in-out">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-purple-700">About the App</h2>
                <p className="mb-6 text-sm md:text-base leading-relaxed text-gray-700">
                Clocked In is a group habit tracker that keeps you and your friends accountable. Stay consistent with daily habits like fitness, reading, or studying by checking in with a photo.
                </p>
                <ul className="list-disc list-inside mb-2 text-sm md:text-base text-gray-700">
                    <li><strong>Join or Create a Group:</strong> Each group shares a common habit.</li>
                    <li><strong>Check In Daily:</strong> Upload a photo proving you completed the habit.</li>
                    <li><strong>Keep the Streak Alive:</strong> If anyone misses a day, the streak resets.</li>
                    <li><strong>Disappearing Photos:</strong> Submissions vanish after 24 hours.</li>
                </ul>
                <button onClick={toggleModal} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition duration-200">
                    Close
                </button>
            </div>
        </div>
      )}
    </section>
  );
};

export default LandingPage;
