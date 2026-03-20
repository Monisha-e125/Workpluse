import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectAnalytics } from '../../store/slices/analyticsSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import StatusDonut from '../../components/charts/StatusDonut';
import PriorityBarChart from '../../components/charts/PriorityBarChart';
import CompletionLineChart from '../../components/charts/CompletionLineChart';
import TeamWorkloadBar from '../../components/charts/TeamWorkloadBar';
import MoodTrendLine from '../../components/charts/MoodTrendLine';
import ActivityHeatmap from '../../components/charts/ActivityHeatmap';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import analyticsService from '../../services/analyticsService';

const Analytics = () => {
  const dispatch = useDispatch();
  const { projectAnalytics, isLoading } = useSelector((s) => s.analytics);
  const { projects } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const [selectedProject, setSelectedProject] = useState('');
  const [moodData, setMoodData] = useState(null);

  useEffect(() => { dispatch(fetchProjects({})); }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) setSelectedProject(projects[0]._id);
  }, [projects, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchProjectAnalytics(selectedProject));
      analyticsService.getMoodAnalytics(selectedProject)
        .then((res) => setMoodData(res.data.data))
        .catch(() => setMoodData(null));
    }
  }, [dispatch, selectedProject]);

  const pa = projectAnalytics;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📊 Analytics</h1>
          <p className="text-dark-400 text-sm mt-1">Project insights and team performance</p>
        </div>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg px-4 py-2 text-sm focus:border-primary-500 focus:outline-none">
          {projects.map((p) => <option key={p._id} value={p._id}>{p.icon} {p.name}</option>)}
        </select>
      </div>

      {isLoading ? <Loader size="lg" text="Loading analytics..." className="py-20" /> :
       !pa ? <EmptyState icon="📊" title="Select a project" /> : (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Total Tasks', value: pa.overview.totalTasks, icon: '📋', color: 'from-blue-500/20' },
              { label: 'Completed', value: pa.overview.completedTasks, icon: '✅', color: 'from-green-500/20' },
              { label: 'In Progress', value: pa.overview.inProgressTasks, icon: '🔄', color: 'from-yellow-500/20' },
              { label: 'Overdue', value: pa.overview.overdueTasks, icon: '⏰', color: 'from-red-500/20' },
              { label: 'Completion', value: `${pa.overview.completionRate}%`, icon: '📈', color: 'from-purple-500/20' },
              { label: 'Avg Hours', value: pa.overview.avgCompletionHours || '—', icon: '⏱️', color: 'from-cyan-500/20' },
              { label: 'Members', value: pa.overview.totalMembers, icon: '👥', color: 'from-pink-500/20' }
            ].map((s) => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} to-dark-800 border border-dark-700 rounded-xl p-4 text-center`}>
                <span className="text-lg">{s.icon}</span>
                <p className="text-xl font-bold text-white mt-1">{s.value}</p>
                <p className="text-dark-500 text-[10px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusDonut data={pa.statusBreakdown} />
            <PriorityBarChart data={pa.priorityBreakdown} />
          </div>

          {/* Completion Trend */}
          <CompletionLineChart data={pa.completionOverTime} />

          {/* Team Workload */}
          <TeamWorkloadBar data={pa.memberWorkload} />

          {/* Mood Trend */}
          {moodData?.dailyMood && <MoodTrendLine data={moodData.dailyMood} />}

          {/* Activity Heatmap */}
          <ActivityHeatmap userId={user?._id} />
        </div>
      )}
    </div>
  );
};

export default Analytics;