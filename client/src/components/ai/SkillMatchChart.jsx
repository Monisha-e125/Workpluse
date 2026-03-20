import { useEffect, useState } from 'react';
import { Target, Award } from 'lucide-react';
import aiService from '../../services/aiService';
import Loader from '../common/Loader';

const SkillMatchChart = ({ projectId, skills = '' }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSkills, setSearchSkills] = useState(skills);

  const fetchMatches = async () => {
    if (!projectId || !searchSkills.trim()) return;
    setIsLoading(true);
    try {
      const res = await aiService.getSkillMatch(projectId, searchSkills);
      setMatches(res.data.data || []);
    } catch {
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (skills) fetchMatches();
  }, [projectId, skills]);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary-400" />
        <h3 className="text-white font-semibold">Skill Match Finder</h3>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchSkills}
          onChange={(e) => setSearchSkills(e.target.value)}
          placeholder="Enter skills (comma separated): React, Node.js, MongoDB"
          className="flex-1 bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                     px-4 py-2.5 text-sm placeholder-dark-500
                     focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                     focus:outline-none transition-colors"
        />
        <button
          onClick={fetchMatches}
          disabled={!searchSkills.trim() || isLoading}
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg
                     text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Find Matches'}
        </button>
      </div>

      {/* Results */}
      {isLoading ? (
        <Loader size="sm" text="Analyzing skills..." className="py-8" />
      ) : matches.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-10 h-10 text-dark-600 mx-auto mb-2" />
          <p className="text-dark-400 text-sm">
            {searchSkills ? 'No matches found' : 'Enter skills above to find best matches'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match, index) => {
            const scorePercent = Math.round((match.matchScore || 0) * 100);
            const isTopMatch = index === 0;

            return (
              <div
                key={match.developer._id}
                className={`p-4 rounded-xl border transition-all ${
                  isTopMatch
                    ? 'bg-primary-500/10 border-primary-500/30'
                    : 'bg-dark-700 border-dark-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-dark-600 text-dark-300'
                    }`}>
                      {index + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{match.developer.name}</p>
                        {isTopMatch && (
                          <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                            <Award className="w-3 h-3" /> Best Match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      scorePercent >= 70 ? 'text-green-400' :
                      scorePercent >= 40 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {scorePercent}%
                    </p>
                    <p className="text-xs text-dark-500">match</p>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="h-2 bg-dark-600 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      scorePercent >= 70 ? 'bg-green-500' :
                      scorePercent >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>

                {/* Matched & Missing Skills */}
                <div className="flex flex-wrap gap-4">
                  {/* Matched Skills */}
                  {match.matchedSkills?.length > 0 && (
                    <div>
                      <p className="text-xs text-dark-500 mb-1">✅ Matched Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {match.matchedSkills.map((s, i) => (
                          <span key={i} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
                            {s.name} {'★'.repeat(s.proficiency || 1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {match.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-xs text-dark-500 mb-1">❌ Missing Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {match.missingSkills.map((s, i) => (
                          <span key={i} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillMatchChart;