import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setIsSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-dark-400 mb-6">
          We&apos;ve sent a password reset link to <span className="text-primary-400">{email}</span>
        </p>
        <p className="text-dark-500 text-sm mb-6">The link will expire in 10 minutes.</p>
        <Link to="/login" className="text-primary-400 hover:text-primary-300 text-sm font-medium inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link to="/login" className="text-dark-400 hover:text-dark-200 text-sm inline-flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Back to login
      </Link>
      <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
      <p className="text-dark-400 mb-8">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} error={error} required />
        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;