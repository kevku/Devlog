import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config.js';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase-config.js'; // Ensure you have initialized Firestore

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the created user

      // Prepare user data to store in Firestore
      const userData = {
        username: null, // Set to null for now, will be set later
        email: user.email,
        isAdmin: false, // Default value
        createdAt: serverTimestamp(), // Set the createdAt timestamp
        favorites: [], // Initialize an empty array for favorites
        projects: [], // Initialize an empty array for projects
        trash: [] // Initialize an empty array for the trash list
      };

      // Store the user data in Firestore
      await setDoc(doc(db, 'users', user.uid), userData); // Use the user ID as the document ID

      // Redirect to dashboard or login page after successful registration
      navigate('/set-username');
    } catch (err) {
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // User info and token available in result
      console.log(result.user);
      
      // Prepare user data to store in Firestore if user is new
      const userData = {
        username: null, // Set to null for now, will be set later
        email: result.user.email,
        isAdmin: false, // Default value
        createdAt: serverTimestamp(), // Set the createdAt timestamp
        favorites: [], // Initialize an empty array for favorites
        projects: [], // Initialize an empty array for projects
        trash: [] // Initialize an empty array for the trash list
      };

      // Store the user data in Firestore if the user is new
      await setDoc(doc(db, 'users', result.user.uid), userData, { merge: true }); // Merge to avoid overwriting existing data
      navigate('/set-username');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <button onClick={signInWithGoogle}>Sign up with Google</button>
    </div>
  );
};

export default RegisterPage;