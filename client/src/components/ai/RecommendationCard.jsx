const priorityColors = {
  CRITICAL: 'border-red-500 bg-red-500/10',
  HIGH: 'border-orange-500 bg-orange-500/10',
  MEDIUM: 'border-yellow-500 bg-yellow-500/10',
  LOW: 'border-green-500 bg-green-500/10'
};

const RecommendationCard = ({ recommendation }) => {
  const priority = recommendation.priority || 'LOW';
  const colorClass = priorityColors[priority] || priorityColors.LOW;

  return (
    <div className={`border-l-4 rounded-lg p-4 ${colorClass}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{recommendation.icon || '💡'}</span>
        <div>
          <span className="text-xs font-bold text-dark-400 uppercase">
            {priority}
          </span>
          <p className="text-dark-200 text-sm mt-1">
            {recommendation.message || recommendation.action}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;