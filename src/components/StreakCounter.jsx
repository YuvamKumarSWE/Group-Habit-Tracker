import React from 'react';

const StreakCounter = () => {
  const maxStreak = 5; // Maximum streak for the progress bar
  const currentStreak = 2; // Set streak to half of the maximum value

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Number of people completed today: {currentStreak}/{maxStreak}</h2>
      <div style={styles.progressBarContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${(currentStreak / maxStreak) * 100}%`, // Calculate percentage
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  progressBarContainer: {
    height: '20px',
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden', // Ensures the progress bar stays within bounds
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e9d1e8',
    transition: 'width 0.3s ease',
  },
};

export default StreakCounter;
