import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProjectById } from '../../store/slices/projectSlice';
import projectService from '../../services/projectService';
import userService from '../../services/userService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Tabs from '../../components/common/Tabs';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import KanbanBoard from '../Tasks/KanbanBoard';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProject: project, isLoading } = useSelector((s) => s.projects);
  const [activeTab, setActiveTab] = useState('board');
  const [showInvite, setShowInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  // Search users to invite
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await userService.searchUsers(query);
      // Filter out existing members
      const memberIds = project?.members?.map((m) => m.user?._id) || [];
      const filtered = res.data.data.filter(
        (u) => !memberIds.includes(u._id)
      );
      setSearchResults(filtered);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add member to project
  const handleAddMember = async (userId) => {
    setIsAdding(true);
    try {
      await projectService.addMember(id, { userId, role: 'member' });
      toast.success('Member added! 🎉');
      dispatch(fetchProjectById(id));
      setSearchQuery('');
      setSearchResults([]);
      setShowInvite(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setIsAdding(false);
    }
  };

  // Remove member
  const handleRemoveMember = async (userId) => {
    try {
      await projectService.removeMember(id, userId);
      toast.success('Member removed');
      dispatch(fetchProjectById(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove');
    }
  };

  if (isLoading || !project) {
    return <Loader size="lg" text="Loading project..." className="py-20" />;
  }

  const tabs = [
    { value: 'board', label: 'Board', icon: '📋' },
    { value: 'members', label: 'Members', icon: '👥', count: project.members?.length },
    { value: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="btn-icon">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: project.color + '20' }}
          >
            {project.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <span className="text-xs text-dark-500 font-mono">{project.key}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* ═══ Board Tab ═══ */}
      {activeTab === 'board' && <KanbanBoard projectId={id} />}

      {/* ═══ Members Tab ═══ */}
      {activeTab === 'members' && (
        <div>
          {/* Add Member Button */}
          <div className="flex justify-end mb-4">
            <Button icon={UserPlus} size="sm" onClick={() => setShowInvite(true)}>
              Add Member
            </Button>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.members?.map((m) => (
              <div
                key={m.user?._id}
                className="card flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    firstName={m.user?.firstName}
                    lastName={m.user?.lastName}
                    src={m.user?.avatar}
                    size="md"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {m.user?.firstName} {m.user?.lastName}
                    </p>
                    <p className="text-dark-400 text-xs">{m.user?.email}</p>
                    <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">
                      {m.role}
                    </span>
                  </div>
                </div>

                {/* Remove button (not for owner) */}
                {m.user?._id !== project.owner?._id && (
                  <button
                    onClick={() => handleRemoveMember(m.user?._id)}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Invite Modal */}
          <Modal
            isOpen={showInvite}
            onClose={() => {
              setShowInvite(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            title="Add Team Member"
            size="md"
          >
            <div className="space-y-4">
              <Input
                label="Search users by name or email"
                placeholder="Type at least 2 characters..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {/* Search Results */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {isSearching && (
                  <p className="text-dark-400 text-sm text-center py-4">
                    Searching...
                  </p>
                )}

                {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className="text-dark-400 text-sm text-center py-4">
                    No users found matching &quot;{searchQuery}&quot;
                  </p>
                )}

                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                        src={user.avatar}
                        size="sm"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-dark-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddMember(user._id)}
                      isLoading={isAdding}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>

              {searchQuery.length < 2 && (
                <p className="text-dark-500 text-xs text-center">
                  💡 Tip: The user must have a registered account first
                </p>
              )}
            </div>
          </Modal>
        </div>
      )}

      {/* ═══ Settings Tab ═══ */}
      {activeTab === 'settings' && (
        <div className="card">
          <p className="text-dark-400">Project settings coming in Week 12</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;