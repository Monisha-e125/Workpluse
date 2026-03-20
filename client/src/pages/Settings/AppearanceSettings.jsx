import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../store/slices/uiSlice';
import SettingsSection from '../../components/settings/SettingsSection';

const AppearanceSettings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.ui);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light-theme');
      root.classList.add('dark');
    }
  }, [theme]);

  return (
    <SettingsSection title="Appearance" description="Customize the look and feel">
      <div className="space-y-6 max-w-lg">
        {/* Theme Selector */}
        <div>
          <p className="text-sm font-medium text-dark-300 mb-3">Theme</p>
          <div className="grid grid-cols-2 gap-4">
            {/* Dark Theme */}
            <button
              onClick={() => dispatch(setTheme('dark'))}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                theme === 'dark'
                  ? 'border-primary-500 bg-dark-700'
                  : 'border-dark-600 bg-dark-700 hover:border-dark-500'
              }`}
            >
              <div className="w-full h-16 bg-dark-900 rounded-lg mb-3 border border-dark-600 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-8 h-2 bg-dark-600 rounded" />
                  <div className="w-12 h-2 bg-primary-500/30 rounded" />
                </div>
              </div>
              <span className="text-white text-sm font-medium">🌙 Dark</span>
              {theme === 'dark' && (
                <span className="block text-xs text-primary-400 mt-1">✓ Active</span>
              )}
            </button>

            {/* Light Theme */}
            <button
              onClick={() => dispatch(setTheme('light'))}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                theme === 'light'
                  ? 'border-primary-500 bg-dark-700'
                  : 'border-dark-600 bg-dark-700 hover:border-dark-500'
              }`}
            >
              <div className="w-full h-16 bg-gray-100 rounded-lg mb-3 border border-gray-300 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-8 h-2 bg-gray-300 rounded" />
                  <div className="w-12 h-2 bg-primary-500/30 rounded" />
                </div>
              </div>
              <span className="text-white text-sm font-medium">☀️ Light</span>
              {theme === 'light' && (
                <span className="block text-xs text-primary-400 mt-1">✓ Active</span>
              )}
            </button>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <p className="text-sm font-medium text-dark-300 mb-2">Timezone</p>
          <select className="w-full bg-dark-900 border border-dark-600 text-dark-200 rounded-lg px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none">
            <option>Asia/Kolkata (IST, UTC+5:30)</option>
            <option>America/New_York (EST, UTC-5)</option>
            <option>Europe/London (GMT, UTC+0)</option>
            <option>Asia/Tokyo (JST, UTC+9)</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <p className="text-sm font-medium text-dark-300 mb-2">Language</p>
          <select className="w-full bg-dark-900 border border-dark-600 text-dark-200 rounded-lg px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none">
            <option>English</option>
          </select>
          <p className="text-dark-500 text-xs mt-1">More languages coming soon</p>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AppearanceSettings;