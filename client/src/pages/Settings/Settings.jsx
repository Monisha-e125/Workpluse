import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import SettingsSidebar from '../../components/settings/SettingsSidebar';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import AppearanceSettings from './AppearanceSettings';
import SkillsManager from '../../components/settings/SkillsManager';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
        <p className="text-dark-400 text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <SettingsSidebar activeTab={activeTab} onChange={setActiveTab} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'skills' && (
            <SkillsManager skills={user?.skills || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;