import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getPasswordStrength } from '../../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearAuthError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const passwordStrength = getPasswordStrength(formData.password);

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
  const errs = {};
  if (!formData.firstName.trim()) errs.firstName = 'First name is required';
  // REMOVED: if (formData.firstName.trim().length < 2) check
  if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
  // REMOVED: if (formData.lastName.trim().length < 2) check
  if (!formData.email) errs.email = 'Email is required';
  if (!formData.password) errs.password = 'Password is required';
  else if (formData.password.length < 6) errs.password = 'Must be 6+ characters';
  if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm password';
  else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
  setErrors(errs);
  return Object.keys(errs).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register(formData);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Account created! Welcome! 🎉');
      navigate('/dashboard');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
          <span className="text-xl font-bold text-white">W</span>
        </div>
        <span className="text-xl font-bold text-white">
          Work<span className="text-primary-400">Pulse</span> AI
        </span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
      <p className="text-dark-400 mb-8">Join WorkPulse AI and boost your team productivity</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" name="firstName" placeholder="John" icon={User} value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
          <Input label="Last Name" name="lastName" placeholder="Doe" icon={User} value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
        </div>

        <Input label="Email Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleChange} error={errors.email} required />

        <div>
          <Input label="Password" name="password" type="password" placeholder="Min. 8 characters" icon={Lock} value={formData.password} onChange={handleChange} error={errors.password} required />
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < passwordStrength.score ? passwordStrength.color : 'bg-dark-700'}`} />
                ))}
              </div>
              <p className={`text-xs ${passwordStrength.score >= 3 ? 'text-green-400' : 'text-dark-500'}`}>
                {passwordStrength.label}
              </p>
            </div>
          )}
        </div>

        <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm your password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />

        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-dark-400 text-sm mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;