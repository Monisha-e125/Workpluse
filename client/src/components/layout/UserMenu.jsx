import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Avatar from '../common/Avatar';

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      onClick: () => navigate('/settings')
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-700 transition-colors"
      >
        <Avatar
          src={user?.avatar}
          firstName={user?.firstName}
          lastName={user?.lastName}
          size="sm"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-dark-200">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-dark-500 capitalize">{user?.role}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-dark-400 transition-transform hidden md:block ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-dark-700">
            <p className="text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300
                           hover:bg-dark-700 hover:text-white transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-dark-700 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400
                         hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;