// StreakCounter.js
import React, { useState } from 'react';

const StreakCounter = () => {
  const [streak, setStreak] = useState(0);

  const maxStreak = 100; // Maximum streak for the progress bar (you can change this value)

  const incrementStreak = () => {
    if (streak < maxStreak) {
      setStreak(streak + 1);
    }
  };

  return (
    <div>
      <h2>Streak: {streak}/{maxStreak}</h2>
      <button onClick={incrementStreak}>Increase Streak</button>
      <div style={{ marginTop: '20px', width: '100%' }}>
        <div
          style={{
            height: '20px',
            width: '100%',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(streak / maxStreak) * 100}%`,
              backgroundColor: '#4caf50',
              borderRadius: '10px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
