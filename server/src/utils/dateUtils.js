const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const isBetween = require('dayjs/plugin/isBetween');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const duration = require('dayjs/plugin/duration');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Get start and end of today
 */
const getToday = () => {
  return {
    start: dayjs().startOf('day').toDate(),
    end: dayjs().endOf('day').toDate()
  };
};

/**
 * Get start and end of current week
 */
const getCurrentWeek = () => {
  return {
    start: dayjs().startOf('week').toDate(),
    end: dayjs().endOf('week').toDate()
  };
};

/**
 * Get start and end of current month
 */
const getCurrentMonth = () => {
  return {
    start: dayjs().startOf('month').toDate(),
    end: dayjs().endOf('month').toDate()
  };
};

/**
 * Get date X days ago
 */
const getDaysAgo = (days) => {
  return dayjs().subtract(days, 'day').toDate();
};

/**
 * Get date X months ago
 */
const getMonthsAgo = (months) => {
  return dayjs().subtract(months, 'month').toDate();
};

/**
 * Format date for display
 */
const formatDate = (date, format = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

/**
 * Format date-time for display
 */
const formatDateTime = (date, format = 'MMM D, YYYY h:mm A') => {
  return dayjs(date).format(format);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
const timeAgo = (date) => {
  return dayjs(date).fromNow();
};

/**
 * Calculate duration between two dates in hours
 */
const getDurationInHours = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, 'hour', true);
};

/**
 * Calculate duration between two dates in days
 */
const getDurationInDays = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, 'day');
};

/**
 * Check if a date is overdue (past due date)
 */
const isOverdue = (dueDate) => {
  return dayjs(dueDate).isBefore(dayjs());
};

/**
 * Check if a date is today
 */
const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if a date falls on a weekend
 */
const isWeekend = (date) => {
  const day = dayjs(date).day();
  return day === 0 || day === 6;
};

/**
 * Get the week number of the year
 */
const getWeekNumber = (date) => {
  return dayjs(date).week();
};

/**
 * Get working days between two dates (excluding weekends)
 */
const getWorkingDays = (startDate, endDate) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    if (!isWeekend(current.toDate())) {
      count++;
    }
    current = current.add(1, 'day');
  }

  return count;
};

/**
 * Add days to a date (skipping weekends)
 */
const addWorkingDays = (date, days) => {
  let result = dayjs(date);
  let added = 0;

  while (added < days) {
    result = result.add(1, 'day');
    if (!isWeekend(result.toDate())) {
      added++;
    }
  }

  return result.toDate();
};

/**
 * Get date range array between two dates
 */
const getDateRange = (startDate, endDate) => {
  const dates = [];
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dates;
};

module.exports = {
  dayjs,
  getToday,
  getCurrentWeek,
  getCurrentMonth,
  getDaysAgo,
  getMonthsAgo,
  formatDate,
  formatDateTime,
  timeAgo,
  getDurationInHours,
  getDurationInDays,
  isOverdue,
  isToday,
  isWeekend,
  getWeekNumber,
  getWorkingDays,
  addWorkingDays,
  getDateRange
};