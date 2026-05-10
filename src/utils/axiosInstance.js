import axios from 'axios';
import logger from './logger';

const MODULE = 'AxiosInstance';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://open-journal-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request Interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('oj_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.debug(MODULE, `→ ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error) => {
    logger.error(MODULE, 'Request setup error', error);
    return Promise.reject(error);
  }
);

// ── Response Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    logger.debug(MODULE, `← ${response.status} ${response.config.url}`, {
      summary:
        typeof response.data === 'object'
          ? `[${Array.isArray(response.data) ? `Array(${response.data.length})` : 'Object'}]`
          : response.data,
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    logger.error(MODULE, `✗ ${status ?? 'NETWORK'} ${url}`, {
      message: error.message,
      data: error.response?.data,
    });

    if (status === 401) {
      logger.warn(MODULE, '401 Unauthorized — clearing auth state, redirecting to /login');
      localStorage.removeItem('oj_token');
      localStorage.removeItem('oj_user');
      // Avoid circular dep with useAuth — dispatch a custom event instead
      window.dispatchEvent(new Event('oj:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
