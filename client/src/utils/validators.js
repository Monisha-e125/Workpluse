/**
 * Client-side validation helpers (SIMPLIFIED)
 */

export const validateEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  if (!email) return 'Email is required';
  if (!regex.test(email)) return 'Please enter a valid email';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateName = (name, field = 'Name') => {
  if (!name || !name.trim()) return `${field} is required`;
  if (name.trim().length < 2) return `${field} must be at least 2 characters`;
  if (name.trim().length > 50) return `${field} cannot exceed 50 characters`;
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

/**
 * Get password strength (0-4)
 */
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500' },
    { label: 'Good', color: 'bg-green-400' },
    { label: 'Strong', color: 'bg-green-500' }
  ];

  const level = Math.min(score, 4);
  return { score: level, ...levels[level] };
};