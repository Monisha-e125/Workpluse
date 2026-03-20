import { useState } from 'react';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import SettingsSection from './SettingsSection';

const PasswordChange = () => {
  const { editPassword, isLoading } = useAuth();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmNewPassword) {
      toast.error('All fields are required');
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const result = await editPassword(form);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Password changed! 🔒');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      toast.error(result.payload || 'Failed to change password');
    }
  };

  return (
    <SettingsSection title="Change Password" description="Update your password to keep your account secure">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          icon={Lock}
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          required
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          icon={Lock}
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
        />
        <Input
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          icon={Lock}
          value={form.confirmNewPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Update Password
        </Button>
      </form>
    </SettingsSection>
  );
};

export default PasswordChange;