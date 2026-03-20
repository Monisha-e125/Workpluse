import { Outlet, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { setInitialized } from '../../store/slices/authSlice';
import PageLoader from '../common/PageLoader';

const AuthLayout = () => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const dispatch = useDispatch();

  // Safety timeout
  useEffect(() => {
    if (!isInitialized) {
      const timeout = setTimeout(() => {
        dispatch(setInitialized());
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isInitialized, dispatch]);

  // Show loader only briefly while checking initial auth
  if (!isInitialized) {
    return <PageLoader />;
  }

  // Already logged in — redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-dark-900 to-dark-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">W</span>
            </div>
            <span className="text-xl font-bold text-white">
              Work<span className="text-primary-400">Pulse</span> AI
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Intelligent Team Productivity & Wellness Platform
          </h1>
          <p className="text-dark-300 text-lg mb-8">
            AI-powered workload balancing, burnout detection, and team mood
            tracking — all in one place.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '🧠', text: 'AI Workload Balancer' },
              { icon: '🔥', text: 'Burnout Risk Detection' },
              { icon: '💚', text: 'Team Mood Tracking' },
              { icon: '📋', text: 'Real-time Kanban Board' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{feature.icon}</span>
                <span className="text-dark-200">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} WorkPulse AI. Built with MERN Stack.
          </p>
        </div>
      </div>

      {/* Right Side — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;