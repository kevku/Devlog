import React, { useState } from 'react';
import styles from '../styles/Sidebar.module.css'; 
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config'; 
import { MdDashboard } from "react-icons/md";
import { MdPentagon } from "react-icons/md";
import { MdFolder } from "react-icons/md";
import { MdFolderSpecial } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { MdSettings } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useSidebar } from './SideBarContext';

const Sidebar = ({ username }) => {
  const { activeSidebar } = useSidebar(); // Access sidebar state
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
    <div className={`${styles.sidebar} ${activeSidebar ? styles.active : ''}`}>
      <div className={styles.logo}>
        <MdPentagon className={styles.icons} />
        <span>Devlog</span>
      </div>
      <div className={styles.user}>
        <Link to="/profile">
          <p>{username}</p>
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/dashboard">
            <MdDashboard className={styles.icons} />
            <span className={styles.navItem}>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/projects">
            <MdFolder className={styles.icons} />
            <span className={styles.navItem}>Projects</span>
          </Link>
        </li>
        <li>
          <Link to="/bookmarked">
            <MdFolderSpecial className={styles.icons} />
            <span className={styles.navItem}>Favorites</span>
          </Link>
        </li>
        <li>
          <Link to="/trash">
            <BsFillTrashFill className={styles.icons} />
            <span className={styles.navItem}>Trash</span>
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <MdSettings className={styles.icons} />
            <span className={styles.navItem}>Settings</span>
          </Link>
        </li>
        <li>
          <a href="#" onClick={handleLogout}>
            <RiLogoutBoxFill className={styles.icons}/>
            <span className={styles.navItem}>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;