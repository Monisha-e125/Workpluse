import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/slices/projectSlice';
import ChatContainer from '../../components/chat/ChatContainer';
import EmptyState from '../../components/common/EmptyState';

const ProjectChat = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects({}));
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]._id);
    }
  }, [projects, selectedProject]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Team Chat</h1>

      <div className="flex gap-6">
        {/* Project List Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="card p-2 space-y-1">
            <p className="text-xs font-semibold text-dark-500 uppercase px-3 py-2">Projects</p>
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => setSelectedProject(project._id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedProject === project._id
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-dark-400 hover:bg-dark-700 hover:text-dark-200'
                }`}
              >
                <span>{project.icon}</span>
                <span className="truncate">{project.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedProject ? (
            <ChatContainer projectId={selectedProject} />
          ) : (
            <EmptyState
              icon="💬"
              title="Select a project"
              description="Choose a project from the sidebar to start chatting"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;