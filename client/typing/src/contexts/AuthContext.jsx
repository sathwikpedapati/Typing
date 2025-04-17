import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Load stored data on mount
  const storedData = (() => {
    try {
      const data = localStorage.getItem("user_data");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error parsing stored user data", e);
      setError("Failed to load authentication data");
      return null;
    }
  })();

  useEffect(() => {
    if (storedData) {
      const { userToken, user } = storedData;
      setToken(userToken);
      setUserData(user);
      setIsAuthenticated(true);
    }
  }, []);

  // Update login to match (token, user) signature
  const login = (token, user) => {
    try {
      localStorage.setItem("user_data", JSON.stringify({ userToken: token, user }));
      setToken(token);
      setUserData(user);
      setIsAuthenticated(true);
      setError(null);
    } catch (e) {
      console.error("Error saving user data to localStorage", e);
      setError("Failed to save authentication data");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("user_data");
      setToken(null);
      setUserData(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (e) {
      console.error("Error clearing user data from localStorage", e);
      setError("Failed to clear authentication data");
    }
  };

  const value = useMemo(() => ({ login, logout, token, isAuthenticated, userData, error }), [token, userData, isAuthenticated, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);