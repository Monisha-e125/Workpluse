import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoodHistory, fetchTeamMood } from '../../store/slices/moodSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import MoodCheckInWidget from '../../components/mood/MoodCheckInWidget';
import MoodTrendChart from '../../components/mood/MoodTrendChart';
import TeamMoodGrid from '../../components/mood/TeamMoodGrid';
import Loader from '../../components/common/Loader';
import Tabs from '../../components/common/Tabs';

const moodEmojis = { 1: '😫', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };
const trendColors = { improving: 'text-green-400', declining: 'text-red-400', stable: 'text-yellow-400' };

const MoodDashboard = () => {
  const dispatch = useDispatch();
  const { history, teamMood, isLoading } = useSelector((s) => s.mood);
  const { projects } = useSelector((s) => s.projects);
  const [activeTab, setActiveTab] = useState('my-mood');
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    dispatch(fetchMoodHistory({ range: 30 }));
    dispatch(fetchProjects({}));
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) setSelectedProject(projects[0]._id);
  }, [projects, selectedProject]);

  useEffect(() => {
    if (selectedProject && activeTab === 'team-mood') {
      dispatch(fetchTeamMood(selectedProject));
    }
  }, [dispatch, selectedProject, activeTab]);

  const tabs = [
    { value: 'my-mood', label: 'My Mood', icon: '💚' },
    { value: 'team-mood', label: 'Team Mood', icon: '👥' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">💚 Mood Tracker</h1>
          <p className="text-dark-400 text-sm mt-1">Track your well-being and team sentiment</p>
        </div>
      </div>

      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* ═══ MY MOOD TAB ═══ */}
      {activeTab === 'my-mood' && (
        <div className="space-y-6">
          {/* Check-in Widget */}
          {history?.stats?.todaySubmitted ? (
            <div className="card bg-green-500/10 border-green-500/20 text-center py-6">
              <span className="text-4xl">{moodEmojis[history.stats.todayMood] || '✅'}</span>
              <p className="text-green-400 font-medium mt-2">Today&apos;s check-in complete!</p>
              <p className="text-dark-400 text-sm mt-1">You can update it anytime</p>
            </div>
          ) : (
            <MoodCheckInWidget />
          )}

          {/* Stats */}
          {history?.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <p className="text-3xl">{history.stats.avgMood > 0 ? moodEmojis[Math.round(history.stats.avgMood)] : '❓'}</p>
                <p className="text-white font-bold mt-1">{history.stats.avgMood || '—'}</p>
                <p className="text-dark-500 text-xs">Avg Mood (30d)</p>
              </div>
              <div className="card text-center">
                <p className="text-3xl">{history.stats.totalCheckIns}</p>
                <p className="text-dark-400 text-xs mt-1">Check-ins</p>
              </div>
              <div className="card text-center">
                <p className={`text-lg font-bold ${trendColors[history.stats.trend]}`}>
                  {history.stats.trend === 'improving' ? '📈' : history.stats.trend === 'declining' ? '📉' : '➡️'}
                  {' '}{history.stats.trend}
                </p>
                <p className="text-dark-500 text-xs mt-1">Trend</p>
              </div>
              <div className="card text-center">
                <p className="text-white font-bold">{history.stats.last7DaysAvg || '—'}</p>
                <p className="text-dark-500 text-xs mt-1">Last 7d Avg</p>
              </div>
            </div>
          )}

          {/* Trend Chart */}
          {history?.history && <MoodTrendChart history={history.history} />}

          {/* Top Factors */}
          {history?.stats?.topFactors?.length > 0 && (
            <div className="card">
              <h3 className="text-white font-semibold mb-3">Top Mood Factors</h3>
              <div className="space-y-2">
                {history.stats.topFactors.map((f, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-dark-300 text-sm capitalize">{f.factor.replace(/-/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${(f.count / (history.stats.totalCheckIns || 1)) * 100}%` }} />
                      </div>
                      <span className="text-xs text-dark-500">{f.count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ TEAM MOOD TAB ═══ */}
      {activeTab === 'team-mood' && (
        <div className="space-y-6">
          {/* Project Selector */}
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg px-4 py-2 text-sm focus:border-primary-500 focus:outline-none">
            {projects.map((p) => <option key={p._id} value={p._id}>{p.icon} {p.name}</option>)}
          </select>

          {isLoading ? <Loader size="lg" text="Loading team mood..." className="py-20" /> :
           teamMood && (
            <>
              {/* Team Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="card text-center">
                  <p className="text-3xl">{teamMood.summary.teamAvgMood > 0 ? moodEmojis[Math.round(teamMood.summary.teamAvgMood)] : '❓'}</p>
                  <p className="text-white font-bold mt-1">{teamMood.summary.teamAvgMood}</p>
                  <p className="text-dark-500 text-xs">Team Avg</p>
                </div>
                <div className="card text-center">
                  <p className="text-2xl font-bold text-green-400">{teamMood.summary.happyCount}</p>
                  <p className="text-dark-500 text-xs">😊 Happy</p>
                </div>
                <div className="card text-center">
                  <p className="text-2xl font-bold text-yellow-400">{teamMood.summary.neutralCount}</p>
                  <p className="text-dark-500 text-xs">😐 Neutral</p>
                </div>
                <div className="card text-center">
                  <p className="text-2xl font-bold text-red-400">{teamMood.summary.unhappyCount}</p>
                  <p className="text-dark-500 text-xs">😟 Unhappy</p>
                </div>
                <div className="card text-center">
                  <p className="text-2xl font-bold text-dark-400">{teamMood.summary.noDataCount}</p>
                  <p className="text-dark-500 text-xs">❓ No Data</p>
                </div>
              </div>

              <TeamMoodGrid team={teamMood.team} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodDashboard;