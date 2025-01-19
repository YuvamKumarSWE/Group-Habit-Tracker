import React from 'react';

const PhotoGallery = ({ photos }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt={`Gallery Item ${index + 1}`}
          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
        />
      ))}
    </div>
  );
};

export default PhotoGallery;
