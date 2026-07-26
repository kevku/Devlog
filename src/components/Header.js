import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from './SideBarContext.js';

import styles from '../styles/Header.module.css';

const Header = () => {
  const { user } = useContext(AuthContext);
  const { toggleSidebar } = useSidebar();

  return (
    <header className={styles}>
      {user ? (
        <div>
          <GiHamburgerMenu onClick={toggleSidebar} />
        </div>
      ) : (
        <div>
          <Link to="/">
            <h2>Devlog</h2>
          </Link>
          <nav>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;