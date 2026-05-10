import axiosInstance from '../utils/axiosInstance';
import logger from '../utils/logger';

const MODULE = 'authService';

export const login = async (credentials) => {
  logger.info(MODULE, 'Login attempt', { email: credentials.email });
  const { data } = await axiosInstance.post('/auth/login', credentials);
  logger.info(MODULE, 'Login success', { userId: data.user?.id });
  return data; // { token, user }
};

export const register = async (payload) => {
  logger.info(MODULE, 'Register attempt', { email: payload.email });
  const { data } = await axiosInstance.post('/auth/register', payload);
  logger.info(MODULE, 'Register success', { userId: data.user?.id });
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
};

export const updateProfile = async (payload) => {
  logger.info(MODULE, 'Update profile');
  const { data } = await axiosInstance.put('/auth/me', payload);
  return data;
};
