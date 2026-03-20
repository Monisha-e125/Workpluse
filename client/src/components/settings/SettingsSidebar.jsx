import { User, Lock, Bell, Palette, Code } from 'lucide-react';
import { cn } from '../../utils/helpers';

const settingsNav = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account & Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'skills', label: 'Skills', icon: Code }
];

const SettingsSidebar = ({ activeTab, onChange }) => (
  <div className="w-64 flex-shrink-0">
    <div className="card p-2 space-y-1 sticky top-24">
      <p className="text-xs font-semibold text-dark-500 uppercase px-3 py-2">
        Settings
      </p>
      {settingsNav.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
            activeTab === item.id
              ? 'bg-primary-500/10 text-primary-400'
              : 'text-dark-400 hover:bg-dark-700 hover:text-dark-200'
          )}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </div>
  </div>
);

export default SettingsSidebar;