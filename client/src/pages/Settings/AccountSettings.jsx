import PasswordChange from '../../components/settings/PasswordChange';
import SettingsSection from '../../components/settings/SettingsSection';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <div>
      <PasswordChange />

      {/* Account Info */}
      <SettingsSection title="Account Information">
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <span className="text-dark-400 text-sm">Email</span>
            <span className="text-white text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <span className="text-dark-400 text-sm">Role</span>
            <span className="text-primary-400 text-sm capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <span className="text-dark-400 text-sm">Member Since</span>
            <span className="text-white text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <span className="text-dark-400 text-sm">Last Login</span>
            <span className="text-white text-sm">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection title="Danger Zone" description="Irreversible actions">
        <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 font-medium text-sm">Delete Account</p>
              <p className="text-dark-500 text-xs mt-0.5">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => alert('Contact admin to delete account')}>
              Delete Account
            </Button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default AccountSettings;