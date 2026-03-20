import { useEffect, useState } from 'react';
import { Search, Shield, Mail, Briefcase, FolderPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import projectService from '../../services/projectService';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import useDebounce from '../../hooks/useDebounce';

const roleColors = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  manager: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  developer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

const TeamMembers = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Add to project modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch users
  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const params = { limit: 100 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter) params.role = roleFilter;

      const res = await userService.getAllUsers(params);
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load team members');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects (for add to project modal)
  const fetchProjects = async () => {
    try {
      const res = await projectService.getProjects({ limit: 50 });
      setProjects(res.data.data || []);
    } catch {
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchProjects();
  }, [debouncedSearch, roleFilter]);

  // Open add to project modal
  const handleOpenAdd = (user) => {
    setSelectedUser(user);
    setShowAddModal(true);
  };

  // Add user to a project
  const handleAddToProject = async (projectId) => {
    if (!selectedUser) return;
    setIsAdding(true);
    try {
      await projectService.addMember(projectId, {
        userId: selectedUser._id,
        role: 'member'
      });
      toast.success(
        `${selectedUser.firstName} added to project! 🎉`
      );
      setShowAddModal(false);
      setSelectedUser(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add member';
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-dark-400 text-sm mt-1">
            {users.length} member{users.length !== 1 ? 's' : ''} in your organization
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                       pl-10 pr-4 py-2.5 text-sm placeholder-dark-500
                       focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                       focus:outline-none transition-colors"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                     px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none
                     appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Roles</option>
          <option value="admin">👑 Admin</option>
          <option value="manager">📋 Manager</option>
          <option value="developer">💻 Developer</option>
          <option value="viewer">👁️ Viewer</option>
        </select>

        {(search || roleFilter) && (
          <button
            onClick={() => { setSearch(''); setRoleFilter(''); }}
            className="px-4 py-2.5 text-sm text-dark-400 hover:text-white
                       bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Members Grid */}
      {isLoading ? (
        <Loader size="lg" text="Loading team members..." className="py-20" />
      ) : users.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No members found"
          description={search ? `No results for "${search}"` : 'No team members yet'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((member) => (
            <div key={member._id} className="card-hover">
              {/* Top Section */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar
                  firstName={member.firstName}
                  lastName={member.lastName}
                  src={member.avatar}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-dark-400 text-xs truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    {member.email}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5
                               rounded-full mt-2 capitalize border
                               ${roleColors[member.role] || roleColors.viewer}`}
                  >
                    <Shield className="w-3 h-3" />
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {member.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-dark-500 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> Department
                    </span>
                    <span className="text-dark-300">{member.department}</span>
                  </div>
                )}
                {member.designation && (
                  <div className="flex items-center justify-between">
                    <span className="text-dark-500">Designation</span>
                    <span className="text-dark-300">{member.designation}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-dark-700">
                  <p className="text-xs text-dark-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary-500/10 text-primary-400
                                   px-2 py-0.5 rounded border border-primary-500/20"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {member.skills.length > 4 && (
                      <span className="text-xs text-dark-500">
                        +{member.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ ADD TO PROJECT BUTTON ═══ */}
              <div className="mt-4 pt-3 border-t border-dark-700">
                <button
                  onClick={() => handleOpenAdd(member)}
                  className="w-full flex items-center justify-center gap-2 py-2.5
                             text-sm text-primary-400 hover:text-white
                             bg-primary-500/10 hover:bg-primary-500/20
                             border border-primary-500/20 hover:border-primary-500/40
                             rounded-lg transition-all duration-200"
                >
                  <FolderPlus className="w-4 h-4" />
                  Add to Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ ADD TO PROJECT MODAL ═══ */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedUser(null); }}
        title="Add to Project"
        size="md"
      >
        {selectedUser && (
          <div>
            {/* Selected User Info */}
            <div className="flex items-center gap-3 p-4 bg-dark-700 rounded-xl mb-6">
              <Avatar
                firstName={selectedUser.firstName}
                lastName={selectedUser.lastName}
                src={selectedUser.avatar}
                size="md"
              />
              <div>
                <p className="text-white font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-dark-400 text-xs">{selectedUser.email}</p>
              </div>
            </div>

            {/* Project List */}
            <p className="text-sm text-dark-300 mb-3">
              Select a project to add <span className="text-white font-medium">{selectedUser.firstName}</span> to:
            </p>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-dark-400 text-sm">No projects found.</p>
                <p className="text-dark-500 text-xs mt-1">Create a project first.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-3 bg-dark-900
                               border border-dark-700 rounded-lg hover:border-dark-600
                               transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: (project.color || '#6366f1') + '20' }}
                      >
                        {project.icon || '📁'}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{project.name}</p>
                        <p className="text-dark-500 text-xs">
                          {project.members?.length || 0} members · {project.taskCount || 0} tasks
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddToProject(project._id)}
                      isLoading={isAdding}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeamMembers;