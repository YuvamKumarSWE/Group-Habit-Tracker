import React, { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        if (password !== retypePassword) {
          alert("Passwords do not match!");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, "users", user.uid), { name, email });
        alert("User registered successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Signed in successfully!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (result._tokenResponse.isNewUser) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
        });
      }
      alert("Signed in with Google successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-100 to-pink-100 p-4 text-customPurple">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="font-bold text-2xl text-center mb-6">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 w-full border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 w-full border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 w-full border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
        {isSignUp && (
          <input
            type="password"
            placeholder="Retype Password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            className="p-3 w-full border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        )}
        <button
          onClick={handleAuth}
          className="w-full bg-customPurple text-white py-3 rounded mb-4 hover:bg-violet-600"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-500 text-white py-3 rounded mb-4 hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <GoogleIcon /> Continue with Google
        </button>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-customPurple underline text-sm"
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignInForm;