import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, user }) => {
  return user ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;