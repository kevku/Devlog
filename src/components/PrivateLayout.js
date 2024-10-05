import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'; // Import Navigate for redirection
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase-config'; // Import your Firestore instance
import Sidebar from './SideBar';

const PrivateLayout = ({ user }) => { // Accept user as a prop
  const [loading, setLoading] = useState(true); // State to manage loading
  const [usernameExists, setUsernameExists] = useState(true); // State to check if username exists
  const [username, setUsername] = useState(''); // State to store the username

  useEffect(() => {
    const checkUsernameExists = async () => {
      if (user && user.uid) { // Check if user and uid are available
        const userDocRef = doc(firestore, 'users', user.uid); // Reference to the user document
        const userDocSnap = await getDoc(userDocRef); // Fetch the user document

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data(); // Use const here for userData
          setUsername(userData.username || ''); // Set the username if it exists
          setUsernameExists(!!userData.username); // Check if username exists
        } else {
          console.log('No user document found.');
          setUsernameExists(false); // If the document doesn't exist, set usernameExists to false
        }
      } else {
        setUsernameExists(false); // If no user is authenticated, consider username as not existing
      }
      setLoading(false); // Mark loading as complete
    };

    checkUsernameExists(); // Call the fetch function
  }, [user]);

  // While loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>; // Or your preferred loading component
  }

  // If username doesn't exist, navigate to SetUsernamePage
  if (!usernameExists) {
    return <Navigate to="/set-username" />; // Redirect to SetUsernamePage if username is null
  }

  return (
    <div className="private-layout">
      <Sidebar username={username} /> {/* Pass username as a prop to Sidebar */}
      <div className="main-content">
        <Outlet /> {/* Renders the matched private route content */}
      </div>
    </div>
  );
};

export default PrivateLayout;