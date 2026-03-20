import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { setInitialized } from '../../store/slices/authSlice';
import PageLoader from './PageLoader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isInitialized, isLoading, user } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  // Safety: If stuck loading for more than 5 seconds, force initialize
  useEffect(() => {
    if (!isInitialized) {
      const timeout = setTimeout(() => {
        dispatch(setInitialized());
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isInitialized, dispatch]);

  // Still checking auth state
  if (!isInitialized || isLoading) {
    return <PageLoader />;
  }

  // Not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check (if specified)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;