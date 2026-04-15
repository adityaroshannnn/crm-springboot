import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // { username, roles }
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on first load
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('jwt_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('jwt_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const resp = await api.post('/api/auth/login', { username, password });
    const { token, username: name, roles } = resp.data;
    
    // Store JWT token and user info
    localStorage.setItem('jwt_token', token);
    const userData = { username: name, roles: Array.from(roles) };
    localStorage.setItem('jwt_user', JSON.stringify(userData));
    setUser(userData);
    
    return { success: true, roles: Array.from(roles), username: name };
  };

  const logout = async () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_user');
    setUser(null);
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
