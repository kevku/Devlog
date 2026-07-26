import logo from './logo.svg';
import './App.css';

import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider, { AuthContext } from './context/AuthProvider';
import { SidebarProvider } from './components/SideBarContext';
import HomePage from './pages/HomePage';
import AuthCallback from './pages/AuthCallback';
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

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <SidebarProvider>
          <Layout />
        </SidebarProvider>
      ),
      children: [
        { index: true, element: <HomePage /> },
        { path: 'auth/callback', element: <AuthCallback /> },
        { path: 'login', element: <PublicRoute user={user}><LoginPage /></PublicRoute> },
        { path: 'register', element: <PublicRoute user={user}><RegisterPage /></PublicRoute> },
        { path: 'set-username', element: <PrivateRoute user={user}><SetUsernamePage /></PrivateRoute> },
        { path: 'dashboard', element: <PrivateRoute user={user}><PrivateLayout user={user}><DashboardPage /></PrivateLayout></PrivateRoute> },
        { path: 'bookmarked', element: <PrivateRoute user={user}><PrivateLayout user={user}><BookmarkedPage /></PrivateLayout></PrivateRoute> },
        { path: 'projects', element: <PrivateRoute user={user}><PrivateLayout user={user}><ProjectsPage /></PrivateLayout></PrivateRoute> },
        { path: 'trash', element: <PrivateRoute user={user}><PrivateLayout user={user}><TrashPage /></PrivateLayout></PrivateRoute> },
        { path: '*', element: <ErrorPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;