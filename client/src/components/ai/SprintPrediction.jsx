import { useEffect, useState } from 'react';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import aiService from '../../services/aiService';
import Loader from '../common/Loader';

const predictionStyles = {
  ahead: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: '🚀', label: 'Ahead of Schedule' },
  'on-track': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: '✅', label: 'On Track' },
  'at-risk': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: '⚠️', label: 'At Risk' },
  behind: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '🚨', label: 'Behind Schedule' }
};

const SprintPrediction = ({ projectId, sprintId }) => {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !sprintId) return;

    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await aiService.getSprintPrediction(projectId, sprintId);
        setPrediction(res.data.data);
      } catch {
        setPrediction(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [projectId, sprintId]);

  if (isLoading) return <Loader size="sm" text="Predicting sprint..." className="py-8" />;
  if (!prediction) return null;

  const style = predictionStyles[prediction.prediction] || predictionStyles['on-track'];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-400" />
        <h3 className="text-white font-semibold">Sprint Prediction</h3>
      </div>

      {/* Prediction Status */}
      <div className={`${style.bg} border ${style.border} rounded-xl p-5 mb-6 text-center`}>
        <span className="text-4xl">{style.icon}</span>
        <p className={`text-lg font-bold mt-2 ${style.color}`}>{style.label}</p>
        <p className="text-dark-400 text-sm mt-1">{prediction.message}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Target className="w-4 h-4 text-dark-400" />
          <span className="text-dark-300 text-sm">
            Confidence: <span className="text-white font-bold">{prediction.confidence}%</span>
          </span>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-dark-400">Sprint Progress</span>
          <span className="text-white font-bold">{prediction.completionRate}%</span>
        </div>
        <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              prediction.completionRate >= 80 ? 'bg-green-500' :
              prediction.completionRate >= 50 ? 'bg-blue-500' :
              prediction.completionRate >= 25 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${prediction.completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-dark-700 rounded-lg p-3 text-center">
          <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{prediction.completedTasks}</p>
          <p className="text-xs text-dark-500">Completed</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{prediction.inProgressTasks}</p>
          <p className="text-xs text-dark-500">In Progress</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-3 text-center">
          <AlertTriangle className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{prediction.remainingTasks}</p>
          <p className="text-xs text-dark-500">Remaining</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-3 text-center">
          <Target className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{prediction.totalPoints}</p>
          <p className="text-xs text-dark-500">Total Points</p>
        </div>
      </div>

      {/* Points Progress */}
      {prediction.totalPoints > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-700">
          <div className="flex justify-between text-xs text-dark-400 mb-1">
            <span>Story Points Progress</span>
            <span className="text-white">
              {prediction.completedPoints} / {prediction.totalPoints} SP
            </span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{
                width: `${(prediction.completedPoints / prediction.totalPoints) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintPrediction;