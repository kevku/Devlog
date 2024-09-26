import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookmarkedPage from './pages/BookmarkedPage';
import ProjectsPage from './pages/ProjectsPage';
import TrashPage from './pages/TrashPage';
import ErrorPage from './pages/ErrorPage';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import PrivateLayout from './components/PrivateLayout';

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
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: 'register',
        element: <PublicRoute><RegisterPage /></PublicRoute>,
      },
      {
        path: 'dashboard',
        element: <PrivateRoute><PrivateLayout><DashboardPage /></PrivateLayout></PrivateRoute>,
      },
      {
        path: 'bookmarked',
        element: <PrivateRoute><PrivateLayout><BookmarkedPage /></PrivateLayout></PrivateRoute>,
      },
      {
        path: 'projects',
        element: <PrivateRoute><PrivateLayout><ProjectsPage /></PrivateLayout></PrivateRoute>,
      },
      {
        path: 'trash',
        element: <PrivateRoute><PrivateLayout><TrashPage /></PrivateLayout></PrivateRoute>,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
