/**
 * Firebase Configuration and Initialization
 * This module initializes Firebase services including Authentication and Firestore
 */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
/**
 * Firebase configuration object
 * Contains essential credentials and settings for Firebase services
 * Uses environment variables for secure credential management
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// Initialize Firebase application instance
const app = initializeApp(firebaseConfig);
// Initialize Firebase Analytics
const analytics = getAnalytics(app);
// Initialize Firebase Authentication
const auth = getAuth(app);
// Initialize Firestore Database
const db = getFirestore(app);
export { app, analytics, auth, db };

