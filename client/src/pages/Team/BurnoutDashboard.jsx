import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamBurnout, fetchBurnout } from '../../store/slices/aiSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import BurnoutRiskGauge from '../../components/ai/BurnoutRiskGauge';
import BurnoutFactorCard from '../../components/ai/BurnoutFactorCard';
import RecommendationCard from '../../components/ai/RecommendationCard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const levelColors = { LOW: 'text-green-400', MEDIUM: 'text-yellow-400', HIGH: 'text-orange-400', CRITICAL: 'text-red-400' };

const BurnoutDashboard = () => {
  const dispatch = useDispatch();
  const { teamBurnout, burnout, isLoading } = useSelector((s) => s.ai);
  const { projects } = useSelector((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => { dispatch(fetchProjects({})); }, [dispatch]);
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) setSelectedProject(projects[0]._id);
  }, [projects, selectedProject]);
  useEffect(() => {
    if (selectedProject) dispatch(fetchTeamBurnout(selectedProject));
  }, [dispatch, selectedProject]);

  const handleViewDetail = (userId) => {
    setSelectedUserId(userId);
    dispatch(fetchBurnout(userId));
    setShowDetail(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🔥 Burnout Detection</h1>
          <p className="text-dark-400 text-sm mt-1">AI-powered burnout risk analysis</p>
        </div>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg px-4 py-2 text-sm focus:border-primary-500 focus:outline-none">
          {projects.map((p) => <option key={p._id} value={p._id}>{p.icon} {p.name}</option>)}
        </select>
      </div>

      {isLoading ? <Loader size="lg" text="AI analyzing burnout risk..." className="py-20" /> :
       !teamBurnout ? <EmptyState icon="🔥" title="Select a project" /> : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-3xl font-bold text-white">{teamBurnout.summary.avgRiskScore}%</p>
              <p className="text-dark-400 text-xs mt-1">Avg Risk Score</p>
            </div>
            {[
              { label: 'Critical', count: teamBurnout.summary.criticalCount, color: 'text-red-400', emoji: '🔴' },
              { label: 'High', count: teamBurnout.summary.highCount, color: 'text-orange-400', emoji: '🟠' },
              { label: 'Medium', count: teamBurnout.summary.mediumCount, color: 'text-yellow-400', emoji: '🟡' },
              { label: 'Low', count: teamBurnout.summary.lowCount, color: 'text-green-400', emoji: '🟢' }
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-dark-400 text-xs mt-1">{s.emoji} {s.label}</p>
              </div>
            ))}
          </div>

          {/* Team Cards */}
          <h2 className="text-lg font-semibold text-white mb-4">Individual Risk Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamBurnout.team.map((member) => (
              <div key={member.userId} className="card-hover cursor-pointer" onClick={() => handleViewDetail(member.userId)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                      {member.userName?.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <p className="text-white font-medium">{member.userName}</p>
                  </div>
                  <span className={`text-sm font-bold ${levelColors[member.riskLevel]}`}>{member.riskScore}%</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${member.riskScore > 70 ? 'bg-red-500' : member.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${member.riskScore}%` }} />
                </div>
                <p className={`text-xs mt-2 ${levelColors[member.riskLevel]}`}>{member.riskLevel} Risk</p>
                <p className="text-xs text-primary-400 mt-2">Click for details →</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Burnout Risk Detail" size="lg">
        {!burnout ? <Loader size="md" className="py-10" /> : (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <BurnoutRiskGauge riskScore={burnout.riskScore} riskLevel={burnout.riskLevel} />
              <div>
                <h3 className="text-xl font-bold text-white">{burnout.userName}</h3>
                <p className={`text-sm font-medium ${levelColors[burnout.riskLevel]}`}>{burnout.riskLevel} Burnout Risk</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-dark-300 mb-3">Risk Factors</h4>
              <div className="space-y-2">
                {burnout.factors?.map((f, i) => <BurnoutFactorCard key={i} factor={f} />)}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-dark-300 mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {burnout.recommendations?.map((r, i) => <RecommendationCard key={i} recommendation={r} />)}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BurnoutDashboard;