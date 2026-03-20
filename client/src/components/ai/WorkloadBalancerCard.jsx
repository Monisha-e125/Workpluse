import { useState } from 'react';
import toast from 'react-hot-toast';
import { Zap, RefreshCw } from 'lucide-react';
import aiService from '../../services/aiService';
import Button from '../common/Button';
import AIAssignmentResult from './AIAssignmentResult';

const WorkloadBalancerCard = ({ taskId, projectId, onAssigned }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAutoAssign = async () => {
    setIsLoading(true);
    try {
      const res = await aiService.autoAssign({ taskId, projectId });
      setResult(res.data.data);
      setShowResult(true);
      toast.success(
        `AI assigned to ${res.data.data.assignedTo.name} (${Math.round(res.data.data.matchScore * 100)}% match)`,
        { duration: 5000, icon: '🧠' }
      );
      onAssigned?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI assignment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* AI Assign Button */}
      <Button
        variant="primary"
        size="sm"
        icon={Zap}
        isLoading={isLoading}
        onClick={handleAutoAssign}
        className="bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700"
      >
        AI Auto-Assign
      </Button>

      {/* Result Modal */}
      {showResult && result && (
        <AIAssignmentResult
          result={result}
          isOpen={showResult}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
};

export default WorkloadBalancerCard;