import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { createProject } from '../../store/slices/projectSlice';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import { projectColors } from '../../utils/colorUtils';

const icons = ['📁', '🚀', '💻', '📱', '🎯', '⚡', '🔥', '💡', '🎨', '🛠️', '📊', '🌐'];

const CreateProject = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1', icon: '📁' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Project name is required'); return; }
    setIsLoading(true);
    try {
      await dispatch(createProject(form)).unwrap();
      toast.success('Project created! 🚀');
      setForm({ name: '', description: '', color: '#6366f1', icon: '📁' });
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to create project');
    } finally { setIsLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>Create Project</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Project Name" name="name" placeholder="My Awesome Project" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <TextArea label="Description" name="description" placeholder="What is this project about?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {icons.map((icon) => (
              <button key={icon} type="button" onClick={() => setForm({ ...form, icon })}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${form.icon === icon ? 'bg-primary-500/20 ring-2 ring-primary-500' : 'bg-dark-700 hover:bg-dark-600'}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {projectColors.map((color) => (
              <button key={color} type="button" onClick={() => setForm({ ...form, color })}
                className={`w-8 h-8 rounded-full transition-all ${form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-800 scale-110' : 'hover:scale-110'}`}
                style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProject;