import { useState } from 'react';
import { Plus, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import SettingsSection from './SettingsSection';

const SkillsManager = ({ skills = [] }) => {
  const { fetchProfile } = useAuth();
  const [currentSkills, setCurrentSkills] = useState(skills);
  const [newSkill, setNewSkill] = useState('');
  const [newProficiency, setNewProficiency] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (currentSkills.find((s) => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      toast.error('Skill already added');
      return;
    }

    setCurrentSkills([
      ...currentSkills,
      { name: newSkill.trim(), proficiency: newProficiency, lastUsed: new Date() }
    ]);
    setNewSkill('');
    setNewProficiency(3);
  };

  const removeSkill = (index) => {
    setCurrentSkills(currentSkills.filter((_, i) => i !== index));
  };

  const updateProficiency = (index, prof) => {
    const updated = [...currentSkills];
    updated[index].proficiency = prof;
    setCurrentSkills(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userService.updateSkills(currentSkills);
      await fetchProfile();
      toast.success('Skills updated! 🎯');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsSection
      title="Skills & Expertise"
      description="Add your skills for AI-powered task matching. The AI workload balancer uses these to assign the right tasks."
    >
      {/* Current Skills */}
      <div className="space-y-3 mb-6">
        {currentSkills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-white font-medium text-sm">{skill.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Proficiency Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateProficiency(index, star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= skill.proficiency
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-dark-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => removeSkill(index)}
                className="p-1 hover:bg-dark-600 rounded text-dark-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {currentSkills.length === 0 && (
          <p className="text-dark-500 text-sm py-4 text-center">
            No skills added yet. Add your first skill below.
          </p>
        )}
      </div>

      {/* Add New Skill */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="e.g., React.js, Node.js, Python"
          className="flex-1 bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                     px-4 py-2.5 text-sm placeholder-dark-500
                     focus:border-primary-500 focus:ring-1 focus:ring-primary-500
                     focus:outline-none"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
        />
        <select
          value={newProficiency}
          onChange={(e) => setNewProficiency(parseInt(e.target.value))}
          className="bg-dark-900 border border-dark-600 text-dark-200 rounded-lg
                     px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value={1}>★ Beginner</option>
          <option value={2}>★★ Basic</option>
          <option value={3}>★★★ Intermediate</option>
          <option value={4}>★★★★ Advanced</option>
          <option value={5}>★★★★★ Expert</option>
        </select>
        <Button icon={Plus} onClick={addSkill} variant="secondary">
          Add
        </Button>
      </div>

      {/* Save */}
      <Button onClick={handleSave} isLoading={isSaving}>
        Save Skills
      </Button>
    </SettingsSection>
  );
};

export default SkillsManager;