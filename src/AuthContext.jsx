import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    if (!userData || !userData.id || !userData.username) {
      console.error('Invalid user data provided to login:', userData);
      return;
    }
    console.log('AuthContext login:', userData); // Debug
    setUser(userData); // Expecting { id, username, isAdmin }
  };

  const logout = () => {
    console.log('Logging out'); // Debug
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};