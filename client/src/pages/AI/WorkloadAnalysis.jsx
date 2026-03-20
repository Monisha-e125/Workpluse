import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkload } from '../../store/slices/aiSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import WorkloadMeterBar from '../../components/ai/WorkloadMeterBar';
import RecommendationCard from '../../components/ai/RecommendationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const WorkloadAnalysis = () => {
  const dispatch = useDispatch();
  const { workload, isLoading } = useSelector((s) => s.ai);
  const { projects } = useSelector((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => { dispatch(fetchProjects({})); }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) setSelectedProject(projects[0]._id);
  }, [projects, selectedProject]);

  useEffect(() => {
    if (selectedProject) dispatch(fetchWorkload(selectedProject));
  }, [dispatch, selectedProject]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🧠 AI Workload Analysis</h1>
          <p className="text-dark-400 text-sm mt-1">AI-powered team workload balancing</p>
        </div>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg px-4 py-2 text-sm focus:border-primary-500 focus:outline-none">
          {projects.map((p) => <option key={p._id} value={p._id}>{p.icon} {p.name}</option>)}
        </select>
      </div>

      {isLoading ? <Loader size="lg" text="AI analyzing workload..." className="py-20" /> :
       !workload ? <EmptyState icon="🧠" title="Select a project" description="Choose a project to analyze" /> : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Active Tasks', value: workload.insights.totalActiveTasks, icon: '📋', color: 'from-blue-500/20' },
              { label: 'Avg Tasks/Member', value: workload.insights.avgTasksPerMember, icon: '📊', color: 'from-green-500/20' },
              { label: 'Team Members', value: workload.insights.totalMembers, icon: '👥', color: 'from-purple-500/20' },
              { label: 'Need Redistribution', value: workload.insights.redistributionNeeded ? 'Yes ⚠️' : 'No ✅', icon: '⚖️', color: 'from-orange-500/20' }
            ].map((s) => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} to-dark-800 border border-dark-700 rounded-xl p-5`}>
                <span className="text-2xl">{s.icon}</span>
                <p className="text-2xl font-bold text-white mt-2">{s.value}</p>
                <p className="text-dark-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Team Workload */}
          <h2 className="text-lg font-semibold text-white mb-4">Team Workload Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workload.team.map((m) => <WorkloadMeterBar key={m.user._id} member={m} />)}
          </div>

          {/* AI Recommendations */}
          <h2 className="text-lg font-semibold text-white mb-4">🤖 AI Recommendations</h2>
          <div className="space-y-3">
            {workload.insights.recommendations.map((r, i) => <RecommendationCard key={i} recommendation={r} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkloadAnalysis;