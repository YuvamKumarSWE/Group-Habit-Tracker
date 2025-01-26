// AuthState.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const AuthState = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  return (
    <div className="p-4">
      {user ? (
        <h3 className="text-customPurple">
          Welcome, <strong>{user.email}</strong>!
        </h3>
      ) : (
        <h3 className="text-customPurple">Not signed in</h3>
      )}
    </div>
  );
};

export default AuthState;