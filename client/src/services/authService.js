import api from './api';

const authService = {
  // ── Register ──
  register: (userData) => {
    return api.post('/auth/register', {
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password
      // ✅ Don't send confirmPassword to backend
    });
  },

  // ── Login ──
  login: (credentials) => {
    return api.post('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    });
  },

  // ── Logout ──
  logout: () => {
    return api.post('/auth/logout');
  },

  // ── Get Current User ──
  getMe: () => {
    return api.get('/auth/me');
  },

  // ── Update Profile ──
  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData);
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
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/refresh-token', { refreshToken });
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