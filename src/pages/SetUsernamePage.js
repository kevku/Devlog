import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { firestore } from '../firebase-config';

const SetUsernamePage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get the current user

  useEffect(() => {
    // Check if the user is logged in
    if (!user) {
      navigate('/login'); // Redirect to the login page if not authenticated
    } else {
      // Check if the username is already set
      const checkUsername = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.username) {
            // If username is already set, navigate to the dashboard
            navigate('/dashboard');
          }
        }
      };

      checkUsername(); // Call the check function
    }
  }, [user, navigate]);

  // Check if username is taken
  const isUsernameTaken = async (username) => {
    const q = query(collection(firestore, 'users'), where('username', '==', username)); // Use firestore instead of storage
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Return true if username is taken
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate username (only alphanumeric characters)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setError('Username can only contain alphanumeric characters.');
      return;
    }

    // Check if username is taken
    setLoading(true);
    const taken = await isUsernameTaken(username);
    if (taken) {
      setError('Username is already taken. Please choose another one.');
      setLoading(false);
      return;
    }

    try {
      // Save the username to Firestore
      const userRef = doc(firestore, 'users', user.uid); // Use firestore for user reference
      await setDoc(userRef, { username }, { merge: true }); // Merge the new username with existing data
      navigate('/dashboard'); // Redirect to the dashboard after setting the username
    } catch (error) {
      setError('Error setting username. Please try again.');
      console.error('Error setting username:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Set Your Username</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Setting...' : 'Set Username'}
        </button>
      </form>
    </div>
  );
};

export default SetUsernamePage;