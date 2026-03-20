import { useNavigate } from 'react-router-dom';
import { Users, CheckSquare, Calendar } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { formatDate, calculatePercentage } from '../../utils/helpers';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const completion = calculatePercentage(project.completedTaskCount, project.taskCount);

  return (
    <div onClick={() => navigate(`/projects/${project._id}`)}
      className="card-hover cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: project.color + '20' }}>
            {project.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">{project.name}</h3>
            <span className="text-xs text-dark-500 font-mono">{project.key}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-dark-600 text-dark-400'}`}>
          {project.status}
        </span>
      </div>

      {project.description && (
        <p className="text-dark-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-dark-500 mb-1">
          <span>{project.completedTaskCount}/{project.taskCount} tasks</span>
          <span>{completion}%</span>
        </div>
        <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${completion}%` }} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-700">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((m) => (
            <Avatar key={m.user?._id || m._id} firstName={m.user?.firstName} lastName={m.user?.lastName} src={m.user?.avatar} size="xs" />
          ))}
          {project.members?.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center text-xs text-dark-300 border-2 border-dark-800">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-dark-500">{formatDate(project.updatedAt)}</span>
      </div>
    </div>
  );
};

export default ProjectCard;