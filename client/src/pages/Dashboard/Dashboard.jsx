import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, FolderKanban, Clock, AlertTriangle, TrendingUp, Flame } from 'lucide-react';
import { fetchDashboard } from '../../store/slices/analyticsSlice';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
import { formatDate, timeAgo } from '../../utils/helpers';

const moodEmojis = { 1: '😫', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };
const burnoutColors = { LOW: 'text-green-400', MEDIUM: 'text-yellow-400', HIGH: 'text-orange-400', CRITICAL: 'text-red-400' };

const actionLabels = {
  'task-created': '📋 Created task', 'task-updated': '✏️ Updated task',
  'task-completed': '✅ Completed task', 'task-assigned': '👤 Assigned task',
  'task-status-changed': '🔄 Changed status', 'comment-added': '💬 Added comment',
  'project-created': '📁 Created project', 'member-added': '👥 Added member',
  'mood-checkin': '💚 Mood check-in'
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { dashboard, isLoading } = useSelector((s) => s.analytics);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (isLoading || !dashboard) return <Loader size="lg" text="Loading dashboard..." className="py-20" />;

  const d = dashboard;

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 border border-primary-500/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} firstName={user?.firstName} lastName={user?.lastName} size="xl" />
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.firstName}! 👋</h1>
            <p className="text-dark-400 mt-1">Here&apos;s your productivity snapshot for today.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard icon={<FolderKanban className="w-5 h-5 text-blue-400" />}
          value={d.projects} label="Projects" color="from-blue-500/20" />
        <StatCard icon={<CheckSquare className="w-5 h-5 text-green-400" />}
          value={d.tasks.completed} label="Completed" color="from-green-500/20" />
        <StatCard icon={<Clock className="w-5 h-5 text-yellow-400" />}
          value={d.tasks.active} label="Active Tasks" color="from-yellow-500/20" />
        <StatCard icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          value={d.tasks.overdue} label="Overdue" color="from-red-500/20" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
          value={d.tasks.completedThisWeek} label="Done This Week" color="from-purple-500/20" />
        <StatCard icon={<Flame className="w-5 h-5 text-orange-400" />}
          value={<span className={burnoutColors[d.burnoutLevel]}>{d.burnoutRisk}%</span>}
          label="Burnout Risk" color="from-orange-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" /> Upcoming Deadlines
          </h3>
          {d.upcomingDeadlines?.length > 0 ? (
            <div className="space-y-3">
              {d.upcomingDeadlines.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${task.project?._id}`)}>
                  <div>
                    <p className="text-white text-sm font-medium">{task.title}</p>
                    <p className="text-dark-500 text-xs">{task.project?.icon} {task.project?.name}</p>
                  </div>
                  <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">
                    {formatDate(task.dueDate, 'MMM D')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-500 text-sm py-4 text-center">No upcoming deadlines 🎉</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          {d.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {d.recentActivity.slice(0, 8).map((activity) => (
                <div key={activity._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {actionLabels[activity.action]?.split(' ')[0] || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-dark-300 text-sm">
                      {actionLabels[activity.action]?.split(' ').slice(1).join(' ') || activity.action}
                      {activity.details?.title && (
                        <span className="text-white"> "{activity.details.title}"</span>
                      )}
                      {activity.details?.taskId && (
                        <span className="text-dark-500"> ({activity.details.taskId})</span>
                      )}
                    </p>
                    <p className="text-dark-500 text-xs mt-0.5">{timeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-500 text-sm py-4 text-center">No recent activity</p>
          )}
        </div>
      </div>

      {/* Today's Mood */}
      <div className="mt-6 card text-center">
        <p className="text-dark-400 text-sm mb-2">Today&apos;s Mood</p>
        <span className="text-4xl">
          {d.todayMood ? moodEmojis[d.todayMood] : '❓'}
        </span>
        <p className="text-dark-500 text-xs mt-2">
          {d.todayMood ? 'Check-in complete!' : 'No mood check-in today'}
        </p>
        {!d.todayMood && (
          <button onClick={() => navigate('/mood')}
            className="mt-3 text-sm text-primary-400 hover:text-primary-300">
            Submit check-in →
          </button>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => (
  <div className={`bg-gradient-to-br ${color} to-dark-800 border border-dark-700 rounded-xl p-4`}>
    <div className="mb-2">{icon}</div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-dark-400 text-xs mt-0.5">{label}</p>
  </div>
);

export default Dashboard;