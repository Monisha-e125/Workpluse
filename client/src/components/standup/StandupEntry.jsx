const StandupEntry = ({ entry }) => {
  if (!entry.user) return null;
  const userName = `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim();
  const initials = userName.split(' ').map((n) => n[0]).join('') || '?';

  return (
    <div className="card-hover">
      {/* User Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
        <div>
          <p className="text-white font-medium">{userName}</p>
        </div>
      </div>

      {/* Yesterday */}
      {entry.yesterday?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-400 mb-1.5">✅ Yesterday</p>
          <ul className="space-y-1">
            {entry.yesterday.map((item, i) => (
              <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="text-dark-500 mt-0.5">•</span>
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Today */}
      {entry.today?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-blue-400 mb-1.5">🔄 Today</p>
          <ul className="space-y-1">
            {entry.today.map((item, i) => (
              <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="text-dark-500 mt-0.5">•</span>
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Blockers */}
      {entry.blockers?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-400 mb-1.5">🚫 Blockers</p>
          <ul className="space-y-1">
            {entry.blockers.map((item, i) => (
              <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                {item.description}
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  item.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.severity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No activity */}
      {(!entry.yesterday || entry.yesterday.length === 0) &&
       (!entry.today || entry.today.length === 0) &&
       (!entry.blockers || entry.blockers.length === 0) && (
        <p className="text-dark-500 text-sm italic">No activity detected</p>
      )}
    </div>
  );
};

export default StandupEntry;