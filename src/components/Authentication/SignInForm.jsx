import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    try {
      if (isSignUp) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-200 to-pink-200 text-customPurple">
      <h2 className="font-obitron text-3xl mb-4">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>
      {isSignUp && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded mb-2"
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded mb-2"
      />
      <button
        onClick={handleAuth}
        className="bg-customPurple text-white px-4 py-2 rounded mb-2"
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-customPurple underline"
      >
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default SignInForm;