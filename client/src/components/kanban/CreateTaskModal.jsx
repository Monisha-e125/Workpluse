import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

const CreateTaskModal = ({
  isOpen,
  onClose,
  projectId,
  defaultStatus = 'backlog',
  onCreated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    type: 'task',
    storyPoints: '3',
    status: defaultStatus,
    dueDate: '',
    assignee: '',
    labels: ''
  });

  // Fetch project members for assignee dropdown
  useEffect(() => {
    if (isOpen && projectId) {
      const fetchMembers = async () => {
        try {
          const res = await projectService.getMembers(projectId);
          setMembers(res.data.data || []);
        } catch {
          setMembers([]);
        }
      };
      fetchMembers();
    }
  }, [isOpen, projectId]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({
        ...prev,
        status: defaultStatus,
        title: '',
        description: ''
      }));
    }
  }, [isOpen, defaultStatus]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsLoading(true);
    try {
      const taskData = {
        title: form.title.trim(),
        description: form.description.trim(),
        project: projectId,
        priority: form.priority,
        type: form.type,
        storyPoints: parseInt(form.storyPoints),
        status: form.status,
        labels: form.labels
          ? form.labels.split(',').map((l) => l.trim()).filter(Boolean)
          : []
      };

      // Only add assignee if selected
      if (form.assignee) {
        taskData.assignee = form.assignee;
      }

      // Only add dueDate if selected
      if (form.dueDate) {
        taskData.dueDate = form.dueDate;
      }

      await taskService.createTask(taskData);

      toast.success('Task created! ✅');

      // Reset form
      setForm({
        title: '',
        description: '',
        priority: 'medium',
        type: 'task',
        storyPoints: '3',
        status: defaultStatus,
        dueDate: '',
        assignee: '',
        labels: ''
      });

      onCreated?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  // Build assignee options from project members
  const assigneeOptions = members.map((m) => ({
    value: m._id || m.user?._id,
    label: `${m.firstName || m.user?.firstName || ''} ${m.lastName || m.user?.lastName || ''} (${m.email || m.user?.email || m.projectRole || m.role || 'member'})`
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Task"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          name="title"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <TextArea
          label="Description"
          name="description"
          placeholder="Add details, requirements, acceptance criteria..."
          value={form.description}
          onChange={handleChange}
          rows={3}
        />

        {/* Assignee — THE KEY FIX */}
        <Select
          label="Assign To"
          name="assignee"
          value={form.assignee}
          onChange={handleChange}
          placeholder="Select assignee (or leave unassigned)"
          options={assigneeOptions}
        />

        {/* Assignee Preview */}
        {form.assignee && (
          <div className="flex items-center gap-2 px-3 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg">
            <span className="text-xs text-primary-400">
              ✅ Assigned to:{' '}
              {assigneeOptions.find((o) => o.value === form.assignee)?.label || 'Selected user'}
            </span>
          </div>
        )}

        {/* Priority & Type */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            options={[
              { value: 'critical', label: '🔴 Critical' },
              { value: 'high', label: '🟠 High' },
              { value: 'medium', label: '🟡 Medium' },
              { value: 'low', label: '🟢 Low' }
            ]}
          />
          <Select
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={[
              { value: 'feature', label: '✨ Feature' },
              { value: 'bug', label: '🐛 Bug' },
              { value: 'improvement', label: '📈 Improvement' },
              { value: 'task', label: '📋 Task' },
              { value: 'epic', label: '🏔️ Epic' }
            ]}
          />
        </div>

        {/* Story Points & Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Story Points"
            name="storyPoints"
            value={form.storyPoints}
            onChange={handleChange}
            options={[1, 2, 3, 5, 8, 13, 21].map((v) => ({
              value: String(v),
              label: `${v} SP`
            }))}
          />
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            { value: 'backlog', label: '📋 Backlog' },
            { value: 'todo', label: '📝 To Do' },
            { value: 'in-progress', label: '🔄 In Progress' },
            { value: 'in-review', label: '👀 In Review' },
            { value: 'testing', label: '🧪 Testing' },
            { value: 'done', label: '✅ Done' }
          ]}
        />

        {/* Labels */}
        <Input
          label="Labels"
          name="labels"
          placeholder="frontend, api, urgent (comma separated)"
          value={form.labels}
          onChange={handleChange}
          helperText="Separate multiple labels with commas"
        />
      </form>
    </Modal>
  );
};

export default CreateTaskModal;