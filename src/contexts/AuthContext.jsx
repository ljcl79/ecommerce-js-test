import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated users database (in memory)
  const [users, setUsers] = useState([
    { id: 1, email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
  ]);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userSession = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (userData) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: users.length + 1,
      ...userData
    };

    setUsers(prev => [...prev, newUser]);
    
    const userSession = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userSession);
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};