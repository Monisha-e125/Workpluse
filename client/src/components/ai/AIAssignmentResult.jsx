import { CheckCircle, Zap, User, BarChart3 } from 'lucide-react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const AIAssignmentResult = ({ result, isOpen, onClose }) => {
  if (!result) return null;

  const { assignedTo, matchScore, reasoning, allScores, task } = result;
  const scorePercent = Math.round((matchScore || 0) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🧠 AI Assignment Result" size="lg"
      footer={<Button onClick={onClose}>Got it</Button>}
    >
      <div className="space-y-6">
        {/* Success Header */}
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Task Assigned Successfully!</h3>
          <p className="text-dark-400 text-sm mt-1">
            AI analyzed your team and found the best match
          </p>
        </div>

        {/* Assigned To */}
        <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg font-bold">
                  {assignedTo?.name?.split(' ').map((n) => n[0]).join('') || '?'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{assignedTo?.name}</p>
                <p className="text-dark-400 text-sm capitalize">{assignedTo?.role || 'Developer'}</p>
              </div>
            </div>

            {/* Match Score */}
            <div className="text-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#6366f1" strokeWidth="6"
                    strokeDasharray={`${scorePercent * 2.64} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-400">{scorePercent}%</span>
                </div>
              </div>
              <p className="text-xs text-dark-400 mt-1">Match</p>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        {reasoning && (
          <div className="bg-dark-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-medium text-white">AI Reasoning</p>
            </div>
            <p className="text-dark-300 text-sm leading-relaxed">{reasoning}</p>
          </div>
        )}

        {/* Task Info */}
        {task && (
          <div className="bg-dark-700 rounded-xl p-4">
            <p className="text-xs text-dark-500 mb-1">Assigned Task</p>
            <p className="text-white font-medium">{task.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-dark-600 text-dark-300 px-2 py-0.5 rounded font-mono">
                {task.taskId}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        )}

        {/* All Candidates */}
        {allScores && allScores.length > 1 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-dark-400" />
              <p className="text-sm font-medium text-dark-300">All Candidates Ranked</p>
            </div>
            <div className="space-y-2">
              {allScores.map((candidate, index) => {
                const isSelected = candidate.developer._id === assignedTo?._id;
                const candScore = Math.round((candidate.totalScore || 0) * 100);

                return (
                  <div
                    key={candidate.developer._id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isSelected
                        ? 'bg-primary-500/10 border-primary-500/30'
                        : 'bg-dark-700 border-dark-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-dark-600 text-dark-300'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary-400' : 'text-dark-200'}`}>
                          {candidate.developer.name}
                          {isSelected && <span className="ml-2 text-xs text-green-400">✓ Selected</span>}
                        </p>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex items-center gap-2 text-xs text-dark-400">
                        <span title="Task Load">📋 {candidate.breakdown?.taskLoad?.score || 0}</span>
                        <span title="Skill Match">🎯 {candidate.breakdown?.skillMatch?.score || 0}</span>
                        <span title="Burnout">🔥 {candidate.breakdown?.burnout?.score || 0}</span>
                      </div>
                      <div className="w-12 text-right">
                        <span className={`text-sm font-bold ${isSelected ? 'text-primary-400' : 'text-dark-300'}`}>
                          {candScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIAssignmentResult;