import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProjects } from '../../store/slices/projectSlice';
import standupService from '../../services/standupService';
import StandupReport from '../../components/standup/StandupReport';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const StandupView = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState('');
  const [standup, setStandup] = useState(null);
  const [standupHistory, setStandupHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { dispatch(fetchProjects({})); }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) setSelectedProject(projects[0]._id);
  }, [projects, selectedProject]);

  // Fetch latest standup
  useEffect(() => {
    if (selectedProject) fetchLatest();
  }, [selectedProject]);

  const fetchLatest = async () => {
    setIsLoading(true);
    try {
      const res = await standupService.getLatest(selectedProject);
      setStandup(res.data.data);

      const historyRes = await standupService.getStandups(selectedProject, { limit: 5 });
      setStandupHistory(historyRes.data.data || []);
    } catch {
      setStandup(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await standupService.generate(selectedProject);
      setStandup(res.data.data);
      toast.success('Standup generated! 🤖');
      fetchLatest();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-primary-400" />
            Auto Standups
          </h1>
          <p className="text-dark-400 text-sm mt-1">AI-generated daily standup reports</p>
        </div>

        <div className="flex items-center gap-3">
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg px-4 py-2 text-sm focus:border-primary-500 focus:outline-none">
            {projects.map((p) => <option key={p._id} value={p._id}>{p.icon} {p.name}</option>)}
          </select>

          <Button icon={RefreshCw} onClick={handleGenerate} isLoading={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700">
            Generate Standup
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader size="lg" text="Loading standup..." className="py-20" />
      ) : standup ? (
        <StandupReport standup={standup} />
      ) : (
        <EmptyState
          icon="🤖"
          title="No standups yet"
          description="Click 'Generate Standup' to create an AI-powered daily report from your team's activity"
          action={
            <Button icon={Bot} onClick={handleGenerate} isLoading={isGenerating}>
              Generate First Standup
            </Button>
          }
        />
      )}

      {/* History */}
      {standupHistory.length > 1 && (
        <div className="mt-8">
          <h3 className="text-white font-semibold mb-4">Previous Standups</h3>
          <div className="space-y-2">
            {standupHistory.slice(1).map((s) => (
              <button
                key={s._id}
                onClick={() => setStandup(s)}
                className="w-full card-hover flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📋</span>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-dark-500 text-xs">{s.entries?.length || 0} entries</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    (s.aiInsights?.sprintHealth || 0) > 60 ? 'text-green-400' :
                    (s.aiInsights?.sprintHealth || 0) > 30 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {s.aiInsights?.sprintHealth || 0}%
                  </span>
                  <p className="text-dark-500 text-xs">health</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandupView;