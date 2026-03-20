import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format date for display
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!date) return '—';
  return dayjs(date).format(format);
};

/**
 * Format date-time
 */
export const formatDateTime = (date) => {
  if (!date) return '—';
  return dayjs(date).format('MMM D, YYYY h:mm A');
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const timeAgo = (date) => {
  if (!date) return '—';
  return dayjs(date).fromNow();
};

/**
 * Check if date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
};

/**
 * Get user initials from name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Get initials from first and last name
 */
export const getInitialsFromNames = (firstName, lastName) => {
  const f = firstName?.[0]?.toUpperCase() || '';
  const l = lastName?.[0]?.toUpperCase() || '';
  return f + l || '??';
};

/**
 * Truncate string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generate a random avatar color based on string
 */
export const getAvatarColor = (str) => {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500',
    'bg-green-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-blue-500', 'bg-violet-500', 'bg-fuchsia-500'
  ];

  if (!str) return colors[0];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Format large numbers (1000 → 1K, 1000000 → 1M)
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
};

/**
 * Check if running on mobile
 */
export const isMobile = () => {
  return window.innerWidth < 768;
};

/**
 * Generate a random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Parse API error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

/**
 * Classname helper (similar to clsx but simpler)
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};