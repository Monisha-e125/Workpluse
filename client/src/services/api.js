import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
  timeout: 30000,
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

    if (import.meta.env.DEV) {
      console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ═══════════════════════════════════════════
// RESPONSE INTERCEPTOR
// ═══════════════════════════════════════════
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ✅ NEVER try refresh on these auth routes
    const skipRefreshRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh-token',
      '/auth/forgot-password',
      '/auth/reset-password'
    ];

    const shouldSkipRefresh = skipRefreshRoutes.some(
      (route) => originalRequest.url?.includes(route)
    );

    // ── Handle 401 — Only refresh for protected routes ──
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // ✅ Send refreshToken in body (not just cookies)
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear everything and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // ── Handle 422 Validation Error ──
    if (error.response?.status === 422) {
      console.error('⚠️ Validation error:', error.response.data?.errors);
    }

    // ── Handle 403 Forbidden ──
    if (error.response?.status === 403) {
      console.error('🚫 Access forbidden:', error.response.data?.message);
    }

    // ── Handle 429 Rate Limited ──
    if (error.response?.status === 429) {
      console.error('⚠️ Rate limited:', error.response.data?.message);
    }

    // ── Handle Network Errors ──
    if (!error.response) {
      console.error('🌐 Network error — server might be starting up');
      error.message =
        'Network error. Server might be starting up, please wait 30 seconds and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;