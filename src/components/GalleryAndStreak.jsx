import React from 'react';
import PhotoGallery from './PhotoGallery';
import StreakCounter from './StreakCounter';

const GalleryAndStreak = () => {
  const photos = [
    'https://media.istockphoto.com/id/1214281152/photo/pov-of-a-young-man-on-gym-mat.jpg?s=612x612&w=0&k=20&c=ZB3l4iSKo7QYMFK5HxGAvNiLItiOxPd7A05V056HDEk=',
    'https://media.istockphoto.com/id/2166710415/video/woman-lifting-a-dumbbell-in-the-gym.jpg?s=640x640&k=20&c=LLDStzsguwilDbkt1lYdDe60YvA-k_KbfRk_sRdQHgg=',
    'https://media.istockphoto.com/id/544480768/photo/athlete-taking-dumbbells-from-floor-man-pov.jpg?s=612x612&w=0&k=20&c=l4fJbSpijPpxlTr06WrzGauwLaQzas9bBNvXcrhRWXg=',
    'https://images.pond5.com/pov-first-person-view-lifting-footage-164588801_iconl.jpeg',
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>Photo Gallery</h1>
      <PhotoGallery photos={photos} />
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <StreakCounter />
      </div>
    </div>
  );
};

export default GalleryAndStreak;
