import React, { useState } from 'react';
import styles from '../styles/Sidebar.module.css'; 
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config'; 

const Sidebar = ({ username }) => {
  const [isActive, setIsActive] = useState(true);

  // Handle user sign out
  const handleLogout = async (e) => {
    e.preventDefault(); // Prevents the default behavior of the <a> tag
    try {
      await signOut(auth);
      // Optionally, you can redirect the user or do something after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`${styles.sidebar} ${isActive ? styles.active : ''}`}>
      <div className='top'>
        <div className='logo'>
          <i className='bx bxl-codepen'></i>
          <span>Devlog</span>
        </div>
      </div>
      <div className='user'>
        {/* Profile Image */}
        <Link to="/profile">
          <p>{username}</p>
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/dashboard">
            <i className='bx bx-grid-alt'></i>
            <span className='nav-item'>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/projects">
            <i className='bx bx-folder'></i>
            <span className='nav-item'>Projects</span>
          </Link>
        </li>
        <li>
          <Link to="/bookmarked">
            <i className='bx bxs-star'></i>
            <span className='nav-item'>Favorites</span>
          </Link>
        </li>
        <li>
          <Link to="/trash">
            <i className='bx bx-trash alt'></i>
            <span className='nav-item'>Trash</span>
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <i className='bx bx-cog'></i>
            <span className='nav-item'>Settings</span>
          </Link>
        </li>
        <li>
          <a href="#" onClick={handleLogout}>
            <i className='bx bx-log-out'></i>
            <span className='nav-item'>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;