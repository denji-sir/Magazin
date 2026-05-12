import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages authentication state and user profile
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize: check if we have tokens and fetch user profile
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/auth/me/');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login method
   */
  const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    const { access, refresh, user: userData } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  /**
   * Logout method
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update profile
   */
  const updateProfile = async (data) => {
    const response = await api.patch('/auth/me/', data);
    setUser(response.data);
    return response.data;
  };

  const changePassword = async (payload) => {
    const response = await api.post('/auth/change-password/', payload);
    return response.data;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
