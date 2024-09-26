import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } =  useAuth();

  if (user) {
    // Redirect to main page is user is already authenticated
    return <Navigate to='/dashboard' />;
  }
  return children;
};

export default PublicRoute;