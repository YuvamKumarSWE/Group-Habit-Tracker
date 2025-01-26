// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3x3viN2JOyWxr8EW7kofDieqB2U_InkU",
  authDomain: "group-habit-tracker-d0cc2.firebaseapp.com",
  projectId: "group-habit-tracker-d0cc2",
  storageBucket: "group-habit-tracker-d0cc2.firebasestorage.app",
  messagingSenderId: "516872435803",
  appId: "1:516872435803:web:1665ae87659583d34c677e",
  measurementId: "G-8TFEFH8N05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app, analytics, auth };