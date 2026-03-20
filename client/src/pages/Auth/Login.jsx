import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearAuthError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearAuthError();
    }
  }, [error, clearAuthError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(formData);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Welcome back! 🚀');
      navigate('/dashboard');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
          <span className="text-xl font-bold text-white">W</span>
        </div>
        <span className="text-xl font-bold text-white">
          Work<span className="text-primary-400">Pulse</span> AI
        </span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
      <p className="text-dark-400 mb-8">Sign in to continue to WorkPulse AI</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded bg-dark-700 border-dark-600 text-primary-500 focus:ring-primary-500" />
            <span className="text-sm text-dark-400">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Sign In
        </Button>
      </form>

      <p className="text-center text-dark-400 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default Login;