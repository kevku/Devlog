import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config'; // Import Firebase auth
import AuthProvider from './context/AuthProvider';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetUsernamePage from './pages/SetUsernamePage';
import DashboardPage from './pages/DashboardPage';
import BookmarkedPage from './pages/BookmarkedPage';
import ProjectsPage from './pages/ProjectsPage';
import TrashPage from './pages/TrashPage';
import ErrorPage from './pages/ErrorPage';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import PrivateLayout from './components/PrivateLayout';

function App() {
  const [user, setUser] = useState(null); // Track the current user
  const [loading, setLoading] = useState(true); // Track if the auth state is still being checked

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once the auth state is resolved
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator or blank screen while waiting for auth state
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />, // Public layout with Header, etc.
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'login',
          element: <PublicRoute user={user}><LoginPage /></PublicRoute>,
        },
        {
          path: 'register',
          element: <PublicRoute user={user}><RegisterPage /></PublicRoute>,
        },
        {
          path: 'set-username', // New route for setting the username
          element: <PrivateRoute user={user}><SetUsernamePage /></PrivateRoute>,
        },
        {
          path: 'dashboard',
          element: <PrivateRoute user={user}><PrivateLayout user={user}><DashboardPage /></PrivateLayout></PrivateRoute>,
        },
        {
          path: 'bookmarked',
          element: <PrivateRoute user={user}><PrivateLayout user={user}><BookmarkedPage /></PrivateLayout></PrivateRoute>,
        },
        {
          path: 'projects',
          element: <PrivateRoute user={user}><PrivateLayout user={user}><ProjectsPage /></PrivateLayout></PrivateRoute>,
        },
        {
          path: 'trash',
          element: <PrivateRoute user={user}><PrivateLayout user={user}><TrashPage /></PrivateLayout></PrivateRoute>,
        },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
