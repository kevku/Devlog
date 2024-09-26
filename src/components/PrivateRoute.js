import React, { Children } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to='/login' />;
  }
  return children
};

export default PrivateRoute;