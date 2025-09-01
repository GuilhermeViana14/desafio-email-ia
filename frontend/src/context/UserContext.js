import React, { createContext, useState, useEffect } from 'react';
import { getSavedUser } from '../services/Auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = getSavedUser();
    if (saved) setUser(saved);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};