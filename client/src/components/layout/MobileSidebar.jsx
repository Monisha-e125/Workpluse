import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setMobileSidebarOpen } from '../../store/slices/uiSlice';
import { X } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { SIDEBAR_NAV } from '../../utils/constants';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Brain, Flame,
  Bot, Heart, Users, BarChart3, MessageSquare, Settings
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, FolderKanban, CheckSquare, Brain, Flame,
  Bot, Heart, Users, BarChart3, MessageSquare, Settings
};

const MobileSidebar = () => {
  const dispatch = useDispatch();
  const { mobileSidebarOpen } = useSelector((state) => state.ui);
  const location = useLocation();

  if (!mobileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => dispatch(setMobileSidebarOpen(false))}
      />

      {/* Sidebar */}
      <aside className="absolute left-0 top-0 h-full w-72 bg-dark-800 border-r border-dark-700 animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">W</span>
            </div>
            <span className="text-lg font-bold text-white">
              Work<span className="text-primary-400">Pulse</span>
            </span>
          </div>
          <button
            onClick={() => dispatch(setMobileSidebarOpen(false))}
            className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {SIDEBAR_NAV.map((section) => (
            <div key={section.section} className="mb-6">
              <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-3 mb-2">
                {section.section}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <div
                      key={item.path}
                      onClick={() => dispatch(setMobileSidebarOpen(false))}
                    >
                      <SidebarItem
                        path={item.path}
                        label={item.label}
                        icon={IconComponent}
                        isActive={location.pathname === item.path}
                        isCollapsed={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default MobileSidebar;