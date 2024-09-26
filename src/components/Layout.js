import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* Render the matched child route */}
      </main>
    </div>
  );
};

export default Layout;