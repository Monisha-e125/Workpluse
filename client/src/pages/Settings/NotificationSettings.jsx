import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import SettingsSection from '../../components/settings/SettingsSection';
import Button from '../../components/common/Button';

const NotificationSettings = () => {
  const { user, editProfile, isLoading } = useAuth();
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    moodReminder: true
  });

  useEffect(() => {
    if (user?.preferences) {
      setPrefs({
        emailNotifications: user.preferences.emailNotifications ?? true,
        pushNotifications: user.preferences.pushNotifications ?? true,
        weeklyReport: user.preferences.weeklyReport ?? true,
        moodReminder: user.preferences.moodReminder ?? true
      });
    }
  }, [user]);

  const handleToggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    const result = await editProfile({ preferences: prefs });
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Notification preferences saved! 🔔');
    }
  };

  const toggles = [
    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email for task assignments, comments, and updates', icon: '📧' },
    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Real-time browser notifications for important events', icon: '🔔' },
    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly summary of your productivity', icon: '📊' },
    { key: 'moodReminder', label: 'Mood Check-in Reminder', desc: 'Daily reminder to submit your mood check-in', icon: '💚' }
  ];

  return (
    <SettingsSection title="Notification Preferences" description="Choose how you want to be notified">
      <div className="space-y-4 max-w-lg mb-6">
        {toggles.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-dark-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                prefs[item.key] ? 'bg-primary-500' : 'bg-dark-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  prefs[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} isLoading={isLoading}>
        Save Preferences
      </Button>
    </SettingsSection>
  );
};

export default NotificationSettings;