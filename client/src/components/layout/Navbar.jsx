import { useDispatch, useSelector } from 'react-redux';
import { Menu, Search, Wifi, WifiOff } from 'lucide-react';
import { toggleMobileSidebar } from '../../store/slices/uiSlice';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import useSocket from '../../hooks/useSocket';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ✅ Initialize socket connection here (runs once when dashboard loads)
  const { isConnected } = useSocket();

  return (
    <header className="bg-dark-800 border-b border-dark-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          onClick={() => dispatch(toggleMobileSidebar())}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                         pl-10 pr-4 py-2 text-sm w-64 placeholder-dark-500
                         focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                         focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Socket Connection Status */}
        <div className="hidden md:flex items-center gap-1.5" title={isConnected ? 'Real-time connected' : 'Connecting...'}>
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-dark-500" />
          )}
          <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-dark-500'}`}>
            {isConnected ? 'Live' : '...'}
          </span>
        </div>

        <NotificationBell />
        <UserMenu user={user} />
      </div>
    </header>
  );
};

export default Navbar;