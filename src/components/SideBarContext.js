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