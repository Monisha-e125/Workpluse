import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getPasswordStrength } from '../../utils/validators';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Must be 8+ characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(token, formData);
      localStorage.setItem('accessToken', response.data.data.accessToken);
      toast.success('Password reset successful! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Link to="/login" className="text-dark-400 hover:text-dark-200 text-sm inline-flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Back to login
      </Link>
      <h1 className="text-3xl font-bold text-white mb-2">Set new password</h1>
      <p className="text-dark-400 mb-8">Create a strong password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input label="New Password" name="password" type="password" placeholder="Min. 8 characters" icon={Lock} value={formData.password} onChange={handleChange} error={errors.password} required />
          {formData.password && (
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < passwordStrength.score ? passwordStrength.color : 'bg-dark-700'}`} />
              ))}
            </div>
          )}
        </div>
        <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm your password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;