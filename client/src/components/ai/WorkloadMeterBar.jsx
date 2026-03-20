const WorkloadMeterBar = ({ member }) => {
  const { workloadLevel, metrics, user } = member;
  return (
    <div className="card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
            {user.name?.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{user.name}</p>
            <p className="text-dark-500 text-xs capitalize">{user.role}</p>
          </div>
        </div>
        <span className="text-sm" title={workloadLevel.level}>{workloadLevel.emoji}</span>
      </div>

      {/* Workload Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-dark-400 mb-1">
          <span>{metrics.activeTasks} active tasks</span>
          <span className="font-medium" style={{ color: workloadLevel.color }}>{workloadLevel.level}</span>
        </div>
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${workloadLevel.percent}%`, backgroundColor: workloadLevel.color }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-dark-700 rounded-lg py-1.5">
          <p className="text-white text-sm font-bold">{metrics.completedTasks}</p>
          <p className="text-dark-500 text-[10px]">Done</p>
        </div>
        <div className="bg-dark-700 rounded-lg py-1.5">
          <p className="text-orange-400 text-sm font-bold">{metrics.criticalTasks}</p>
          <p className="text-dark-500 text-[10px]">Critical</p>
        </div>
        <div className="bg-dark-700 rounded-lg py-1.5">
          <p className="text-red-400 text-sm font-bold">{metrics.overdueTasks}</p>
          <p className="text-dark-500 text-[10px]">Overdue</p>
        </div>
      </div>
    </div>
  );
};

export default WorkloadMeterBar;