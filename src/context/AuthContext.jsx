import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/authService';
import logger from '../utils/logger';

const MODULE = 'AuthContext';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('oj_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Persist user to localStorage
  const persistUser = (userData) => {
    if (userData) {
      localStorage.setItem('oj_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('oj_user');
      localStorage.removeItem('oj_token');
    }
    setUser(userData);
  };

  // Re-verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('oj_token');
    if (!token) {
      setLoading(false);
      return;
    }
    logger.info(MODULE, 'Token found — verifying with server');
    getMe()
      .then((userData) => {
        logger.info(MODULE, 'Token valid', { userId: userData.id });
        persistUser(userData);
      })
      .catch(() => {
        logger.warn(MODULE, 'Token invalid — clearing auth state');
        persistUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen for 401 events from axiosInstance
  useEffect(() => {
    const handler = () => {
      logger.warn(MODULE, '401 event received — logging out');
      persistUser(null);
    };
    window.addEventListener('oj:unauthorized', handler);
    return () => window.removeEventListener('oj:unauthorized', handler);
  }, []);

  const login = useCallback(async (credentials) => {
    logger.info(MODULE, 'Login action triggered');
    const { token, user: userData } = await apiLogin(credentials);
    localStorage.setItem('oj_token', token);
    persistUser(userData);
    logger.info(MODULE, 'User logged in', { userId: userData.id });
    return userData;
  }, []);

  const register = useCallback(async (payload) => {
    logger.info(MODULE, 'Register action triggered');
    const { token, user: userData } = await apiRegister(payload);
    localStorage.setItem('oj_token', token);
    persistUser(userData);
    logger.info(MODULE, 'User registered', { userId: userData.id });
    return userData;
  }, []);

  const logout = useCallback(() => {
    logger.info(MODULE, 'User logged out', { userId: user?.id });
    persistUser(null);
  }, [user]);

  const updateUser = useCallback((userData) => {
    persistUser(userData);
    logger.info(MODULE, 'User profile updated locally');
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, register, logout, updateUser }),
    [user, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
