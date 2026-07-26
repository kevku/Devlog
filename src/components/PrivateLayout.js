import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase-config';
import Sidebar from './SideBar';
import styles from '../styles/PrivateLayout.module.css';
import { useSidebar } from './SideBarContext';

const PrivateLayout = ({ user, children }) => {
  const [loading, setLoading] = useState(true);
  const [usernameExists, setUsernameExists] = useState(true);
  const [username, setUsername] = useState('');
  const { activeSidebar } = useSidebar();

  useEffect(() => {
    const checkUsernameExists = async () => {
      if (user && user.id) {
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          setUsernameExists(false);
        } else if (data && data.username) {
          setUsername(data.username);
          setUsernameExists(true);
        } else {
          setUsernameExists(false);
        }
      } else {
        setUsernameExists(false);
      }
      setLoading(false);
    };

    checkUsernameExists();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!usernameExists) {
    return <Navigate to="/set-username" />;
  }

  return (
    <div className="private-layout">
      <Sidebar username={username} />
      <div className={`${styles.mainContent} ${activeSidebar ? styles.withSidebar : styles.noSidebar}`}>
        {children}
      </div>
    </div>
  );
};

export default PrivateLayout;