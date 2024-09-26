import React from 'react';
import Sidebar from './SideBar'; 
import { Outlet } from 'react-router-dom';

const PrivateLayout = () => {
  return (
    <div className="private-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* Renders the matched private route content */}
      </div>
    </div>
  );
};

export default PrivateLayout;