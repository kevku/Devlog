import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { GiHamburgerMenu } from 'react-icons/gi';

import styles from '../styles/Header.module.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showNav, setShowNav] = useState(false);

  // Listen to authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <header className={styles}>
      {/* If the user is logged in, show profile and logout, else show login and register */}
      {user ? (
        <div>
          {/* Go Back to Dashboard */}
          <GiHamburgerMenu onClick={() => setShowNav(!showNav)} />
        </div>
      ) : (
        <div>
          {/* Logo or Home Link */}
          <Link to="/">
            <h2>Devlog</h2>
          </Link>
          <nav>
            {/* Public Route - Login and Register */}
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