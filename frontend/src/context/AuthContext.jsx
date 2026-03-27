import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // { username, roles }
  const [loading, setLoading] = useState(true);

  // Check session on first load
  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true })
      .then(res => { if (res.data?.username) setUser(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    const resp = await axios.post('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });
    if (resp.data.success) {
      setUser({ username: resp.data.username, roles: resp.data.roles });
    }
    return resp.data;
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
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
