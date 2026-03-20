import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { fetchProjects } from '../../store/slices/projectSlice';
import { fetchWorkload } from '../../store/slices/aiSlice';
import SkillMatchChart from '../../components/ai/SkillMatchChart';
import SprintPrediction from '../../components/ai/SprintPrediction';
import RecommendationCard from '../../components/ai/RecommendationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const AIInsights = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((s) => s.projects);
  const { workload, isLoading } = useSelector((s) => s.ai);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    dispatch(fetchProjects({}));
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]._id);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchWorkload(selectedProject));
    }
  }, [dispatch, selectedProject]);

  const currentProject = projects.find((p) => p._id === selectedProject);
  const activeSprint = currentProject?.sprints?.find((s) => s.status === 'active');

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary-400" />
            AI Insights
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Intelligent analysis and recommendations for your team
          </p>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                     px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
        >
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.icon} {p.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedProject ? (
        <EmptyState icon="🧠" title="Select a project" description="Choose a project to view AI insights" />
      ) : isLoading ? (
        <Loader size="lg" text="AI generating insights..." className="py-20" />
      ) : (
        <div className="space-y-8">
          {/* AI Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-primary-500/10 border border-purple-500/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Workload Balancer</h3>
                  <p className="text-dark-400 text-xs">AI-powered task distribution</p>
                </div>
              </div>
              <p className="text-dark-300 text-sm">
                Analyzes task load, skills, and burnout risk to optimally distribute work across your team.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔥</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Burnout Detection</h3>
                  <p className="text-dark-400 text-xs">7-factor risk analysis</p>
                </div>
              </div>
              <p className="text-dark-300 text-sm">
                Monitors task overload, overdue items, complexity, and more to detect burnout early.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Skill Matching</h3>
                  <p className="text-dark-400 text-xs">Find the right person</p>
                </div>
              </div>
              <p className="text-dark-300 text-sm">
                Matches required skills with team member expertise for optimal task assignment.
              </p>
            </div>
          </div>

          {/* AI Recommendations */}
          {workload?.insights?.recommendations && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🤖</span> AI Recommendations
              </h2>
              <div className="space-y-3">
                {workload.insights.recommendations.map((r, i) => (
                  <RecommendationCard key={i} recommendation={r} />
                ))}
              </div>
            </div>
          )}

          {/* Skill Match Finder */}
          <SkillMatchChart projectId={selectedProject} />

          {/* Sprint Prediction */}
          {activeSprint && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                Sprint Prediction
                <span className="text-xs text-dark-500 font-normal ml-2">
                  {activeSprint.name}
                </span>
              </h2>
              <SprintPrediction projectId={selectedProject} sprintId={activeSprint._id} />
            </div>
          )}

          {!activeSprint && (
            <div className="card text-center py-8">
              <TrendingUp className="w-10 h-10 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 text-sm">
                No active sprint. Start a sprint to see AI predictions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;