import React from "react";
import { useParams } from "react-router-dom";
import StreakCounter from "./StreakCounter";

const mockData = {
  group1: {
    photos: [
      "https://media.istockphoto.com/id/1214281152/photo/pov-of-a-young-man-on-gym-mat.jpg?s=612x612&w=0&k=20&c=ZB3l4iSKo7QYMFK5HxGAvNiLItiOxPd7A05V056HDEk=",
      "https://media.istockphoto.com/id/2166710415/video/woman-lifting-a-dumbbell-in-the-gym.jpg?s=640x640&k=20&c=LLDStzsguwilDbkt1lYdDe60YvA-k_KbfRk_sRdQHgg=",
    ],
    streakCount: 5,
  },
  group2: {
    photos: [
      "https://media.istockphoto.com/id/544480768/photo/athlete-taking-dumbbells-from-floor-man-pov.jpg?s=612x612&w=0&k=20&c=l4fJbSpijPpxlTr06WrzGauwLaQzas9bBNvXcrhRWXg=",
      "https://images.pond5.com/pov-first-person-view-lifting-footage-164588801_iconl.jpeg",
    ],
    streakCount: 10,
  },
};

const GalleryAndStreak = () => {
  const { id } = useParams();
  const groupData = mockData[`group${id}`];

  if (!groupData) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-violet-50">
        <h1 className="text-3xl font-bold text-gray-800">Group Not Found</h1>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-violet-100 to-pink-100 h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-6 w-11/12 max-w-7xl mx-auto">
        {/* Left Box */}
        <div className="flex-1 bg-lightPurple rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-darkText">
              Group Insights
            </h2>
            <p className="text-darkText">
              <img src="https://i.pinimg.com/originals/d7/f2/c9/d7f2c9b7a05f1e67e863b26f4bd3a8aa.jpg"/>
            </p>
        </div>

        {/* Right Section */}
        <div className="flex-2 bg-white rounded-lg p-6 shadow-lg flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-darkText text-center">
            Photo Gallery
          </h1>

          {/* Photo Gallery */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-md flex flex-wrap gap-4 justify-center">
            {groupData.photos.map((photo, index) => (
              <div key={index} className="rounded-lg shadow-md overflow-hidden">
                <img
                  src={photo}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-72 h-48 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Post Button */}
          <div className="flex justify-center">
            <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">
              Post
            </button>
          </div>

          {/* Streak Counter */}
          <div className="bg-lightPurple rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-darkText">
              Progress
            </h2>
            <StreakCounter />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryAndStreak;
