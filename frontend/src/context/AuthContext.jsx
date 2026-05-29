import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  }, []);

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=1';
      }
    };

    window.addEventListener('auth:session-expired', onSessionExpired);
    return () => window.removeEventListener('auth:session-expired', onSessionExpired);
  }, [logout]);

  useEffect(() => {
    const validateSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoggedIn(false);
        setAuthReady(true);
        return;
      }

      try {
        await api.get('/admin/profile');
        setToken(storedToken);
        setIsLoggedIn(true);
      } catch {
        logout();
      } finally {
        setAuthReady(true);
      }
    };

    validateSession();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
