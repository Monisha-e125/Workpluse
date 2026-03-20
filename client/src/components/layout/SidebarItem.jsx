import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';

const SidebarItem = ({ path, label, icon: Icon, isActive, isCollapsed }) => {
  return (
    <NavLink
      to={path}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
        'transition-all duration-200 group relative',
        isActive
          ? 'bg-primary-500/10 text-primary-400'
          : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700',
        isCollapsed && 'justify-center'
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            'w-5 h-5 flex-shrink-0',
            isActive ? 'text-primary-400' : 'text-dark-500 group-hover:text-dark-300'
          )}
        />
      )}

      {!isCollapsed && <span className="truncate">{label}</span>}

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-l" />
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div
          className="absolute left-full ml-3 px-3 py-1.5 bg-dark-700 text-dark-200
                      text-sm rounded-lg shadow-lg opacity-0 invisible
                      group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 whitespace-nowrap z-50
                      border border-dark-600"
        >
          {label}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;