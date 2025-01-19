import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Sign In and Sign Up modes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError(''); // Clear errors when toggling
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      // Handle Sign Up
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Check if email is already registered
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        setError("This email is already registered.");
        return;
      }

      // Save user to localStorage
      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      setError("");
      alert("Account created successfully! You can now sign in.");
      setIsSignUp(false); // Switch to Sign In mode
    } else {
      // Handle Sign In
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      setError("");
      alert("Login successful!");
      navigate("/DashBoard"); // Redirect to dashboard
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen w-screen">
      <div className="flex flex-col items-center justify-center px-6 py-2 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {isSignUp ? 'Sign up for an account' : 'Sign in to your account'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-1 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              {isSignUp && (
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              )}
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              )}
              <button
                type="submit"
                className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isSignUp ? 'Sign up' : 'Sign in'}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {isSignUp
                  ? 'Already have an account? '
                  : 'Don’t have an account yet? '}
                <button
                  type="button"
                  onClick={handleToggle}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;