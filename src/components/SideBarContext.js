/**
 * Used to communicate the Header Hamburger button to the Sidebar
 * Hamburger button is in the Header which is in the Layout, but
 * Sidebar is only in Private Layout
 * 
 * This creates a provider to encapsulate Layout
 * Then both header and Sidebar can coordinate
 */
import React, { createContext, useState, useContext } from 'react';

const SideBarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [activeSidebar, setActiveSidebar] = useState(true);

  const toggleSidebar = () => {
    setActiveSidebar(prevState => !prevState);
  };

  return (
    <SideBarContext.Provider value={{ activeSidebar, toggleSidebar }}>
      {children}
    </SideBarContext.Provider>
  );
};

export const useSidebar = () => useContext(SideBarContext);