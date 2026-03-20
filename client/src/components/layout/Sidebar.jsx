import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { SIDEBAR_NAV } from '../../utils/constants';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Brain, Flame,
  Bot, Heart, Users, BarChart3, MessageSquare, Settings, Zap
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, FolderKanban, CheckSquare, Brain, Flame,
  Bot, Heart, Users, BarChart3, MessageSquare, Settings, Zap
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-dark-800 border-r border-dark-700
                  transition-all duration-300 hidden lg:flex flex-col
                  ${sidebarOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-dark-700">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white">W</span>
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold text-white whitespace-nowrap">
              Work<span className="text-primary-400">Pulse</span>
            </span>
          )}
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {SIDEBAR_NAV.map((section) => (
          <div key={section.section} className="mb-6">
            {sidebarOpen && (
              <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-3 mb-2">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <SidebarItem
                    key={item.path}
                    path={item.path}
                    label={item.label}
                    icon={IconComponent}
                    isActive={location.pathname === item.path}
                    isCollapsed={!sidebarOpen}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings Link */}
      <div className="border-t border-dark-700 p-3">
        <SidebarItem
          path="/settings"
          label="Settings"
          icon={Settings}
          isActive={location.pathname === '/settings'}
          isCollapsed={!sidebarOpen}
        />
      </div>
    </aside>
  );
};

export default Sidebar;