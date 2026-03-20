const crypto = require('crypto');

/**
 * Generate random string (for tokens, keys, etc.)
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a hashed token (for password reset, email verification)
 */
const generateHashedToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return { token, hashedToken };
};

/**
 * Generate project key from name
 * "WorkPulse AI" → "WPA"
 */
const generateProjectKey = (name) => {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }

  return words
    .map((word) => word[0])
    .join('')
    .substring(0, 5)
    .toUpperCase();
};

/**
 * Slugify a string
 * "Hello World" → "hello-world"
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Calculate percentage
 */
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Clean object — remove undefined/null values
 */
const cleanObject = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Pick specific fields from an object
 */
const pickFields = (obj, fields) => {
  const picked = {};
  fields.forEach((field) => {
    if (obj[field] !== undefined) {
      picked[field] = obj[field];
    }
  });
  return picked;
};

/**
 * Omit specific fields from an object
 */
const omitFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach((field) => {
    delete result[field];
  });
  return result;
};

/**
 * Check if a string is a valid MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Generate a random color hex code
 */
const generateRandomColor = () => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#6366f1', '#a855f7'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Capitalize first letter
 */
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string
 */
const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Deep clone an object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Sleep utility for async operations
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  generateRandomString,
  generateHashedToken,
  generateProjectKey,
  slugify,
  calculatePercentage,
  cleanObject,
  pickFields,
  omitFields,
  isValidObjectId,
  generateRandomColor,
  capitalize,
  truncate,
  deepClone,
  sleep
};