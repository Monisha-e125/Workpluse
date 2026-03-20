import { useState } from 'react';
import { Camera } from 'lucide-react';
import Avatar from '../common/Avatar';

const AvatarUpload = ({ user, onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onUpload?.(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <Avatar
          src={preview || user?.avatar}
          firstName={user?.firstName}
          lastName={user?.lastName}
          size="2xl"
        />
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
          <Camera className="w-6 h-6 text-white" />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      <div>
        <p className="text-white font-medium">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-dark-400 text-sm">{user?.email}</p>
        <p className="text-dark-500 text-xs mt-1">
          JPG, PNG or WebP. Max 5MB.
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;