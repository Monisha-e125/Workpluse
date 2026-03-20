import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Clock, AlertTriangle, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchMyTasks } from '../../store/slices/taskSlice';
import taskService from '../../services/taskService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Tabs from '../../components/common/Tabs';
import { priorityColors, typeIcons, statusColors } from '../../utils/colorUtils';
import { formatDate, isOverdue } from '../../utils/helpers';

const statusOptions = [
  { value: 'backlog', label: '📋 Backlog' },
  { value: 'todo', label: '📝 To Do' },
  { value: 'in-progress', label: '🔄 In Progress' },
  { value: 'in-review', label: '👀 In Review' },
  { value: 'testing', label: '🧪 Testing' },
  { value: 'done', label: '✅ Done' }
];

const MyTasks = () => {
  const dispatch = useDispatch();
  const { myTasks, isLoading } = useSelector((s) => s.tasks);
  const [activeFilter, setActiveFilter] = useState('active');
  const [changingStatus, setChangingStatus] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

  // Filter tasks
  const filteredTasks = myTasks.filter((task) => {
    if (activeFilter === 'active') return task.status !== 'done';
    if (activeFilter === 'done') return task.status === 'done';
    if (activeFilter === 'overdue') {
      return task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';
    }
    return true;
  });

  // Change task status
  const handleStatusChange = async (taskId, newStatus) => {
    setChangingStatus(taskId);
    setOpenDropdown(null);

    try {
      await taskService.updateTaskStatus(taskId, { status: newStatus });
      toast.success(
        newStatus === 'done'
          ? 'Task completed! 🎉'
          : `Status changed to ${newStatus}`
      );
      dispatch(fetchMyTasks());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setChangingStatus(null);
    }
  };

  // Quick complete
  const handleQuickComplete = async (taskId) => {
    await handleStatusChange(taskId, 'done');
  };

  // Count stats
  const activeTasks = myTasks.filter((t) => t.status !== 'done').length;
  const doneTasks = myTasks.filter((t) => t.status === 'done').length;
  const overdueTasks = myTasks.filter(
    (t) => t.dueDate && isOverdue(t.dueDate) && t.status !== 'done'
  ).length;

  const tabs = [
    { value: 'all', label: 'All', count: myTasks.length },
    { value: 'active', label: 'Active', count: activeTasks },
    { value: 'done', label: 'Completed', count: doneTasks },
    { value: 'overdue', label: 'Overdue', count: overdueTasks }
  ];

  if (isLoading) {
    return <Loader size="lg" text="Loading your tasks..." className="py-20" />;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📋 My Tasks</h1>
          <p className="text-dark-400 text-sm mt-1">
            {activeTasks} active · {doneTasks} completed · {overdueTasks} overdue
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">{myTasks.length}</p>
          <p className="text-dark-400 text-xs mt-1">Total Tasks</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-400">{doneTasks}</p>
          <p className="text-dark-400 text-xs mt-1">✅ Completed</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-400">{activeTasks}</p>
          <p className="text-dark-400 text-xs mt-1">🔄 Active</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-400">{overdueTasks}</p>
          <p className="text-dark-400 text-xs mt-1">⏰ Overdue</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={activeFilter === 'done' ? '🎉' : '✅'}
          title={
            activeFilter === 'done'
              ? 'No completed tasks yet'
              : activeFilter === 'overdue'
              ? 'No overdue tasks!'
              : 'No tasks assigned'
          }
          description={
            activeFilter === 'active'
              ? "You're all caught up!"
              : activeFilter === 'overdue'
              ? 'Great job staying on schedule!'
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => {
            const pColor = priorityColors[task.priority] || priorityColors.medium;
            const sColor = statusColors[task.status] || statusColors.backlog;
            const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';
            const isChanging = changingStatus === task._id;

            return (
              <div
                key={task._id}
                className={`card-hover flex items-center justify-between ${
                  task.status === 'done' ? 'opacity-60' : ''
                } ${overdue ? 'border-red-500/30' : ''}`}
              >
                {/* Left: Task Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Quick Complete Button */}
                  <button
                    onClick={() => handleQuickComplete(task._id)}
                    disabled={task.status === 'done' || isChanging}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                               flex-shrink-0 transition-all
                               ${task.status === 'done'
                                 ? 'bg-green-500 border-green-500'
                                 : 'border-dark-500 hover:border-green-500 hover:bg-green-500/20'
                               }
                               ${isChanging ? 'animate-pulse' : ''}
                               disabled:cursor-not-allowed`}
                    title={task.status === 'done' ? 'Completed' : 'Mark as done'}
                  >
                    {task.status === 'done' && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {/* Task Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{typeIcons[task.type]}</span>
                      <span className="text-xs text-dark-500 font-mono">{task.taskId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${pColor.bg} ${pColor.text} ${pColor.border}`}>
                        {task.priority}
                      </span>
                      {overdue && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                    </div>
                    <p className={`text-white font-medium mt-1 truncate ${
                      task.status === 'done' ? 'line-through text-dark-400' : ''
                    }`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {task.project && (
                        <span className="text-xs text-dark-500">
                          {task.project.icon} {task.project.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className={`text-xs flex items-center gap-1 ${
                          overdue ? 'text-red-400' : 'text-dark-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {formatDate(task.dueDate, 'MMM D')}
                        </span>
                      )}
                      {task.storyPoints && (
                        <span className="text-xs text-dark-500">{task.storyPoints} SP</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status Dropdown */}
                <div className="relative flex-shrink-0 ml-4">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === task._id ? null : task._id)}
                    disabled={isChanging}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               transition-colors border cursor-pointer
                               ${sColor.bg} ${sColor.text}
                               hover:opacity-80
                               ${isChanging ? 'animate-pulse' : ''}`}
                  >
                    {statusOptions.find((s) => s.value === task.status)?.label || task.status}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Dropdown */}
                  {openDropdown === task._id && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-50 py-1 animate-fade-in">
                        <p className="px-3 py-1.5 text-xs text-dark-500 font-semibold">
                          Change Status
                        </p>
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(task._id, option.value)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors
                                       ${task.status === option.value
                                         ? 'bg-primary-500/10 text-primary-400'
                                         : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                                       }`}
                          >
                            {option.label}
                            {task.status === option.value && (
                              <span className="ml-2 text-xs">✓ Current</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTasks;