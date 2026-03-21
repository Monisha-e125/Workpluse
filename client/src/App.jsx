import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMe, setInitialized } from './store/slices/authSlice';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Projects & Tasks (Week 4-5)
import ProjectList from './pages/Projects/ProjectList';
import ProjectDetail from './pages/Projects/ProjectDetail';
import MyTasks from './pages/Tasks/MyTasks';

// Chat & Notifications (Week 6-7)
import ProjectChat from './pages/chat/ProjectChat';
import NotificationCenter from './pages/Notifications/NotificationCenter';
import TeamMembers from './pages/Team/TeamMembers';

// AI Engine (Week 8-9)
import WorkloadAnalysis from './pages/AI/WorkloadAnalysis';
import AIInsights from './pages/AI/AIInsights';
import BurnoutDashboard from './pages/Team/BurnoutDashboard';

// Mood & Standups (Week 10)
import MoodDashboard from './pages/Mood/MoodDashboard';
import StandupView from './pages/Standups/StandupView';

// Analytics (Week 11)
import Analytics from './pages/Analytics/Analytics';

// Settings (Week 12)
import Settings from './pages/Settings/Settings';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getMe());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-dark-900 text-dark-200">
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Projects & Tasks */}
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/my-tasks" element={<MyTasks />} />

              {/* Team & Chat */}
              <Route path="/team" element={<TeamMembers />} />
              <Route path="/chat" element={<ProjectChat />} />
              <Route path="/notifications" element={<NotificationCenter />} />

              {/* AI Engine */}
              <Route path="/ai/workload" element={<WorkloadAnalysis />} />
              <Route path="/ai/insights" element={<AIInsights />} />
              <Route path="/team/burnout" element={<BurnoutDashboard />} />

              {/* Mood & Standups */}
              <Route path="/mood" element={<MoodDashboard />} />
              <Route path="/standups" element={<StandupView />} />

              {/* Analytics */}
              <Route path="/analytics" element={<Analytics />} />

              {/* Settings */}
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-900">
              <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
              <p className="text-dark-400 text-lg mb-6">Page not found</p>
              <a href="/dashboard" className="btn-primary px-6 py-3 rounded-xl">← Dashboard</a>
            </div>
          } />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;