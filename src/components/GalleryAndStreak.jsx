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

  // Handle the case where the group is not found
  if (!groupData) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Group Not Found</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        {/* Left Box */}
        <div style={styles.leftBox}>
          <h2 style={styles.leftBoxTitle}>Additional Info</h2>
          <p style={styles.leftBoxContent}>
            This box can be used for additional content like stats, notes, or
            other widgets.
          </p>
        </div>

        {/* Right Section */}
        <div style={styles.rightBox}>
          <h1 style={styles.title}>Photo Gallery</h1>

          {/* Inner Box for Photos */}
          <div style={styles.innerBox}>
            <div style={styles.gallery}>
              {groupData.photos.map((photo, index) => (
                <div key={index}>
                  <img
                    src={photo}
                    alt={`Gallery Image ${index + 1}`}
                    style={styles.photo}
                  />
                </div>
              ))}
            </div>
          </div>
          <div style={styles.innerBox}>
            <button style={styles.postButton}>Post</button>
          </div>

          {/* Inner Box for Streak Counter */}
          <div style={styles.innerBox}>
            <h2 style={styles.innerBoxTitle}>Progress</h2>
            <StreakCounter />
          </div>
        </div>
      </div>
    </div>
  );
};

// Styling
const styles = {
  container: {
    width: '100vw',  // Full width of the viewport
    height: '100vh', // Full height of the viewport
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    margin: '0',     // Removes default margin
    backgroundColor: "#f8effa",
  },
  layout: {
    display: "flex",
    gap: "20px",
  },
  leftBox: {
    flex: "1",
    backgroundColor: "#f0f0f0",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  leftBoxTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  leftBoxContent: {
    fontSize: "1rem",
    color: "#555",
  },
  rightBox: {
    flex: "2",
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  innerBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  innerBoxTitle: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
  gallery: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  photoBox: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "300px",
    height: "200px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  postButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
};

export default GalleryAndStreak;
