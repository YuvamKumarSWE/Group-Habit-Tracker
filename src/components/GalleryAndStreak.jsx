
import React from 'react';


import { useParams } from 'react-router-dom';

const mockData = {
  'group1': {
    photos: [
      'https://media.istockphoto.com/id/1214281152/photo/pov-of-a-young-man-on-gym-mat.jpg?s=612x612&w=0&k=20&c=ZB3l4iSKo7QYMFK5HxGAvNiLItiOxPd7A05V056HDEk=',
      'https://media.istockphoto.com/id/2166710415/video/woman-lifting-a-dumbbell-in-the-gym.jpg?s=640x640&k=20&c=LLDStzsguwilDbkt1lYdDe60YvA-k_KbfRk_sRdQHgg=',
    ],
    streakCount: 5,
  },
  'group2': {
    photos: [
      'https://media.istockphoto.com/id/544480768/photo/athlete-taking-dumbbells-from-floor-man-pov.jpg?s=612x612&w=0&k=20&c=l4fJbSpijPpxlTr06WrzGauwLaQzas9bBNvXcrhRWXg=',
      'https://images.pond5.com/pov-first-person-view-lifting-footage-164588801_iconl.jpeg',
    ],
    streakCount: 10,
  },
  // More groups can be added here...
};

const GalleryAndStreak = () => {
  const { id } = useParams();
  console.log(id);
  const groupData = mockData[`group${id}`];

  // Handle the case where the group is not found
  if (!groupData) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>Group Not Found</h1>
          
        </div>
      );
   
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>Photo Gallery - {id}</h1>
      
      {/* Displaying photos dynamically */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {groupData.photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Gallery Image ${index + 1}`}
            style={{ width: '300px', height: '200px', margin: '10px' }}
          />
        ))}
      </div>

     
    </div>
  );
};

export default GalleryAndStreak;