// ═══════════════════════════════════════════
// APPLICATION CONSTANTS
// ═══════════════════════════════════════════

module.exports = {

  // User Roles
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    DEVELOPER: 'developer',
    VIEWER: 'viewer'
  },

  // Role hierarchy (higher number = more permissions)
  ROLE_HIERARCHY: {
    admin: 4,
    manager: 3,
    developer: 2,
    viewer: 1
  },

  // Project Member Roles
  PROJECT_ROLES: {
    LEAD: 'lead',
    MEMBER: 'member',
    VIEWER: 'viewer'
  },

  // Task Statuses
  TASK_STATUS: {
    BACKLOG: 'backlog',
    TODO: 'todo',
    IN_PROGRESS: 'in-progress',
    IN_REVIEW: 'in-review',
    TESTING: 'testing',
    DONE: 'done'
  },

  // Task Priorities
  TASK_PRIORITY: {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  },

  // Task Types
  TASK_TYPE: {
    FEATURE: 'feature',
    BUG: 'bug',
    IMPROVEMENT: 'improvement',
    TASK: 'task',
    EPIC: 'epic'
  },

  // Story Points (Fibonacci)
  STORY_POINTS: [1, 2, 3, 5, 8, 13, 21],

  // Sprint Statuses
  SPRINT_STATUS: {
    PLANNING: 'planning',
    ACTIVE: 'active',
    COMPLETED: 'completed'
  },

  // Project Statuses
  PROJECT_STATUS: {
    ACTIVE: 'active',
    ON_HOLD: 'on-hold',
    COMPLETED: 'completed',
    ARCHIVED: 'archived'
  },

  // Burnout Risk Levels
  BURNOUT_LEVEL: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
  },

  // Mood Values
  MOOD_VALUES: {
    TERRIBLE: 1,
    BAD: 2,
    NEUTRAL: 3,
    GOOD: 4,
    GREAT: 5
  },

  // Mood Factors
  MOOD_FACTORS: [
    'workload',
    'team-dynamics',
    'personal',
    'unclear-requirements',
    'technical-debt',
    'recognition',
    'growth',
    'work-life-balance',
    'tooling-issues',
    'deadline-pressure'
  ],

  // Sentiment Types
  SENTIMENT: {
    POSITIVE: 'positive',
    NEUTRAL: 'neutral',
    NEGATIVE: 'negative'
  },

  // Assignment Methods
  ASSIGNMENT_METHOD: {
    MANUAL: 'manual',
    AI_AUTO: 'ai-auto',
    AI_SUGGESTED: 'ai-suggested'
  },

  // Activity Log Actions
  ACTIVITY_ACTIONS: {
    TASK_CREATED: 'task-created',
    TASK_UPDATED: 'task-updated',
    TASK_COMPLETED: 'task-completed',
    TASK_ASSIGNED: 'task-assigned',
    COMMENT_ADDED: 'comment-added',
    FILE_UPLOADED: 'file-uploaded',
    SPRINT_STARTED: 'sprint-started',
    SPRINT_COMPLETED: 'sprint-completed',
    LOGIN: 'login',
    MOOD_CHECKIN: 'mood-checkin',
    STANDUP_SUBMITTED: 'standup-submitted',
    PROJECT_CREATED: 'project-created',
    MEMBER_ADDED: 'member-added',
    MEMBER_REMOVED: 'member-removed'
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    TASK_ASSIGNED: 'task-assigned',
    TASK_UPDATED: 'task-updated',
    TASK_COMPLETED: 'task-completed',
    COMMENT_ADDED: 'comment-added',
    MENTION: 'mention',
    SPRINT_STARTED: 'sprint-started',
    BURNOUT_ALERT: 'burnout-alert',
    MOOD_REMINDER: 'mood-reminder',
    STANDUP_READY: 'standup-ready',
    PROJECT_INVITE: 'project-invite',
    OVERDUE_TASK: 'overdue-task',
    AI_SUGGESTION: 'ai-suggestion'
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // AI Engine Defaults
  AI_DEFAULTS: {
    MAX_TASKS_PER_DEVELOPER: 10,
    BENCHMARK_COMPLETION_HOURS: 16,
    BURNOUT_HIGH_THRESHOLD: 70,
    BURNOUT_MEDIUM_THRESHOLD: 40,
    SKILL_MATCH_MIN_SCORE: 0.3
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    AUTH_WINDOW_MS: 60 * 60 * 1000, // 1 hour
    AUTH_MAX_REQUESTS: 10
  },

  // File Upload Limits
  FILE_LIMITS: {
    AVATAR_MAX_SIZE: 5 * 1024 * 1024,      // 5MB
    ATTACHMENT_MAX_SIZE: 10 * 1024 * 1024,  // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_ATTACHMENT_TYPES: [
      'image/jpeg', 'image/png', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/csv'
    ]
  }
};