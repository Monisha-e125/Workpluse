import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import AvatarUpload from '../../components/settings/AvatarUpload';
import SettingsSection from '../../components/settings/SettingsSection';

const ProfileSettings = () => {
  const { user, editProfile, isLoading } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', bio: '', phone: '',
    location: '', department: '', designation: '',
    github: '', linkedin: '', portfolio: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        department: user.department || '',
        designation: user.designation || '',
        github: user.socialLinks?.github || '',
        linkedin: user.socialLinks?.linkedin || '',
        portfolio: user.socialLinks?.portfolio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await editProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      phone: form.phone,
      location: form.location,
      department: form.department,
      designation: form.designation,
      socialLinks: {
        github: form.github,
        linkedin: form.linkedin,
        portfolio: form.portfolio
      }
    });

    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Profile updated! ✅');
    } else {
      toast.error(result.payload || 'Failed to update');
    }
  };

  return (
    <div>
      {/* Avatar */}
      <SettingsSection title="Profile Photo">
        <AvatarUpload user={user} />
      </SettingsSection>

      {/* Basic Info */}
      <SettingsSection title="Basic Information" description="Update your personal details">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
            <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <TextArea label="Bio" name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={3} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore, India" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" name="department" value={form.department} onChange={handleChange} placeholder="Engineering" />
            <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Full Stack Developer" />
          </div>

          <div className="pt-4 border-t border-dark-700">
            <p className="text-sm font-medium text-dark-300 mb-3">Social Links</p>
            <div className="space-y-3">
              <Input label="GitHub" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/username" />
              <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
              <Input label="Portfolio" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>Save Changes</Button>
        </form>
      </SettingsSection>
    </div>
  );
};

export default ProfileSettings;