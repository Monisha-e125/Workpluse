import { formatDate } from '../../utils/helpers';
import StandupEntry from './StandupEntry';
import RecommendationCard from '../ai/RecommendationCard';

const StandupReport = ({ standup }) => {
  if (!standup) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">
              📋 Daily Standup Report
            </h3>
            <p className="text-dark-400 text-sm mt-1">
              {formatDate(standup.date, 'dddd, MMMM D, YYYY')}
            </p>
            <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full mt-2 inline-block">
              🤖 {standup.generationType}
            </span>
          </div>

          {/* Sprint Health */}
          {standup.aiInsights && (
            <div className="text-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none"
                    stroke={standup.aiInsights.sprintHealth > 60 ? '#22c55e' : standup.aiInsights.sprintHealth > 30 ? '#eab308' : '#ef4444'}
                    strokeWidth="6"
                    strokeDasharray={`${standup.aiInsights.sprintHealth * 2.64} 264`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{standup.aiInsights.sprintHealth}%</span>
                </div>
              </div>
              <p className="text-xs text-dark-400 mt-1">Sprint Health</p>
            </div>
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {standup.entries?.map((entry, i) => (
          <StandupEntry key={i} entry={entry} />
        ))}
      </div>

      {/* AI Insights */}
      {standup.aiInsights && (
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            🧠 AI Insights
          </h4>

          {/* At Risk Items */}
          {standup.aiInsights.atRiskItems?.length > 0 && (
            <div className="card mb-4 border-orange-500/20">
              <p className="text-sm font-medium text-orange-400 mb-2">⚠️ At Risk Items</p>
              <ul className="space-y-1">
                {standup.aiInsights.atRiskItems.map((item, i) => (
                  <li key={i} className="text-sm text-dark-300">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="space-y-2">
            {standup.aiInsights.recommendations?.map((rec, i) => (
              <RecommendationCard key={i} recommendation={{
                priority: rec.includes('overdue') || rec.includes('below') ? 'HIGH' : 'LOW',
                message: rec,
                icon: rec.includes('Great') || rec.includes('good') ? '✅' : '💡'
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandupReport;