import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Load user data from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.userToken && parsed.user) {
          setToken(parsed.userToken);
          setUserData(parsed.user);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.error("Error loading auth data:", e);
      setError("Failed to load authentication data");
    }
  }, []);

  // Login function with localStorage and error handling
  const login = (token, user) => {
    try {
      if (!token || !user) {
        throw new Error("Invalid token or user data provided");
      }

      const payload = { userToken: token, user };
      localStorage.setItem("user_data", JSON.stringify(payload));
      setToken(token);
      setUserData(user);
      setIsAuthenticated(true);
      setError(null);
    } catch (e) {
      console.error("Login error:", e);
      setError(`Failed to save authentication data: ${e.message}`);
    }
  };

  // Logout function clears localStorage and state
  const logout = () => {
    try {
      localStorage.removeItem("user_data");
      setToken(null);
      setUserData(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (e) {
      console.error("Logout error:", e);
      setError("Failed to clear authentication data");
    }
  };

  // Memoized context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    token,
    userData,
    isAuthenticated,
    login,
    logout,
    error
  }), [token, userData, isAuthenticated, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
