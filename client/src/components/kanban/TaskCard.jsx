import { Clock, MessageSquare, AlertTriangle } from 'lucide-react';
import Avatar from '../common/Avatar';
import { priorityColors, typeIcons } from '../../utils/colorUtils';
import { formatDate, isOverdue } from '../../utils/helpers';

const TaskCard = ({ task, isDragging }) => {
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';
  const pColor = priorityColors[task.priority] || priorityColors.medium;

  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-lg p-4 cursor-grab hover:border-primary-500/50 transition-all ${isDragging ? 'shadow-2xl shadow-primary-500/20 rotate-1 scale-105 border-primary-500' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-dark-500 font-mono">
          {typeIcons[task.type]} {task.taskId}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${pColor.bg} ${pColor.text} ${pColor.border}`}>
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-white text-sm font-medium mb-3 line-clamp-2">{task.title}</h4>

      {/* Labels */}
      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.slice(0, 3).map((l, i) => (
            <span key={i} className="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded">{l}</span>
          ))}
        </div>
      )}

      {/* Story Points */}
      {task.storyPoints && (
        <span className="inline-block text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded mb-3">{task.storyPoints} SP</span>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dark-700">
        {task.assignee ? (
          <Avatar firstName={task.assignee.firstName} lastName={task.assignee.lastName} src={task.assignee.avatar} size="xs" />
        ) : (
          <span className="text-xs text-dark-500">Unassigned</span>
        )}
        <div className="flex items-center gap-2 text-dark-500">
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1 text-xs"><MessageSquare size={12} />{task.comments.length}</span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : ''}`}>
              <Clock size={12} />{formatDate(task.dueDate, 'MMM D')}
              {overdue && <AlertTriangle size={12} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;