import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { fetchProjects } from '../../store/slices/projectSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import ProjectCard from './ProjectCard';
import CreateProject from './CreateProject';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((s) => s.projects);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchProjects({ search })); }, [dispatch, search]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-dark-400 text-sm mt-1">{projects.length} projects</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)}>New Project</Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." className="mb-6 max-w-md" />

      {isLoading ? (
        <Loader size="lg" text="Loading projects..." className="py-20" />
      ) : projects.length === 0 ? (
        <EmptyState icon="📁" title="No projects yet" description="Create your first project to get started" action={<Button icon={Plus} onClick={() => setShowCreate(true)}>Create Project</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
        </div>
      )}

      <CreateProject isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
};

export default ProjectList;