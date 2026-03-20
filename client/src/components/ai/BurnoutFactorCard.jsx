const statusColors = { danger: 'text-red-400 bg-red-500/10', warning: 'text-yellow-400 bg-yellow-500/10', good: 'text-green-400 bg-green-500/10' };

const BurnoutFactorCard = ({ factor }) => (
  <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
    <div className="flex items-center gap-3">
      <span className="text-lg">{factor.icon}</span>
      <div>
        <p className="text-dark-200 text-sm font-medium">{factor.name}</p>
        <p className="text-dark-500 text-xs">{factor.value}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="h-2 w-20 bg-dark-600 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${factor.status === 'danger' ? 'bg-red-500' : factor.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(factor.score / factor.maxScore) * 100}%` }} />
      </div>
      <span className="text-xs text-dark-500 mt-1">{factor.score}/{factor.maxScore}</span>
    </div>
  </div>
);

export default BurnoutFactorCard;