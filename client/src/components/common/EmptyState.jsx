const EmptyState = ({ icon = '📭', title = 'Nothing here yet', description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
    <span className="text-6xl mb-4">{icon}</span>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    {description && <p className="text-dark-400 text-sm mb-6 text-center max-w-sm">{description}</p>}
    {action}
  </div>
);

export default EmptyState;