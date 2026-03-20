import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
  clearError,
  clearMessages
} from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const fetchProfile = useCallback(() => dispatch(getMe()), [dispatch]);

  const editProfile = useCallback(
    (data) => dispatch(updateProfile(data)),
    [dispatch]
  );

  const editPassword = useCallback(
    (data) => dispatch(changePassword(data)),
    [dispatch]
  );

  const clearAuthError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const clearAuthMessages = useCallback(
    () => dispatch(clearMessages()),
    [dispatch]
  );

  return {
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitialized: auth.isInitialized,
    error: auth.error,
    successMessage: auth.successMessage,

    // Actions
    login,
    register,
    logout,
    fetchProfile,
    editProfile,
    editPassword,
    clearAuthError,
    clearAuthMessages
  };
};

export default useAuth;