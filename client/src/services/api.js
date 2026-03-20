import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// ═══════════════════════════════════════════
// REQUEST INTERCEPTOR
// ═══════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════
// RESPONSE INTERCEPTOR
// ═══════════════════════════════════════════
api.interceptors.response.use(
  // Success handler
  (response) => {
    return response;
  },

  // Error handler
  async (error) => {
    const originalRequest = error.config;

    // ── Handle 401 Unauthorized — Token Refresh ──
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data.data;

        // Save new token
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Redirect to login (avoid redirect loop)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // ── Handle 403 Forbidden ──
    if (error.response?.status === 403) {
      console.error('🚫 Access forbidden:', error.response.data.message);
    }

    // ── Handle 429 Too Many Requests ──
    if (error.response?.status === 429) {
      console.error('⚠️ Rate limited:', error.response.data.message);
    }

    // ── Handle Network Errors ──
    if (!error.response) {
      console.error('🌐 Network error — server might be down');
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default api;