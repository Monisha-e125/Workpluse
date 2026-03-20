const levelColors = { LOW: '#22c55e', MEDIUM: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444' };

const BurnoutRiskGauge = ({ riskScore, riskLevel }) => {
  const color = levelColors[riskLevel] || levelColors.LOW;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${riskScore * 2.64} 264`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{riskScore}</span>
          <span className="text-xs text-dark-400">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold" style={{ color }}>{riskLevel}</span>
    </div>
  );
};

export default BurnoutRiskGauge;