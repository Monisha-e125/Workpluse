import api from './api';

// ═══════════════════════════════════════════
// ✅ AUTH SERVICE — All auth API calls
// ═══════════════════════════════════════════
// baseURL is already: https://workpluse.onrender.com/api/v1
// So '/auth/register' becomes: https://workpluse.onrender.com/api/v1/auth/register ✅

const authService = {
  // ── Register ──
  register: (userData) => {
    return api.post('/auth/register', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password
    });
  },

  // ── Login ──
  login: (credentials) => {
    return api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
  },

  // ── Logout ──
  logout: () => {
    return api.post('/auth/logout');
  },

  // ── Get Current User Profile ──
  getMe: () => {
    return api.get('/auth/me');
  },

  // ── Update Profile ──
  updateProfile: (profileData) => {
    return api.put('/auth/update-profile', profileData);
  },

  // ── Change Password ──
  changePassword: (passwordData) => {
    return api.put('/auth/change-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  },

  // ── Refresh Token ──
  refreshToken: () => {
    return api.post('/auth/refresh-token');
  },

  // ── Forgot Password ──
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // ── Reset Password ──
  resetPassword: (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { password });
  }
};

export default authService;