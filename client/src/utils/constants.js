// ═══════════════════════════════════════════
// APPLICATION CONSTANTS (Frontend)
// ═══════════════════════════════════════════

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DEVELOPER: 'developer',
  VIEWER: 'viewer'
};

export const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  developer: 'Developer',
  viewer: 'Viewer'
};

export const ROLE_COLORS = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  manager: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  developer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

// Task Statuses
export const TASK_STATUS = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  IN_REVIEW: 'in-review',
  TESTING: 'testing',
  DONE: 'done'
};

export const TASK_STATUS_LABELS = {
  'backlog': '📋 Backlog',
  'todo': '📝 To Do',
  'in-progress': '🔄 In Progress',
  'in-review': '👀 In Review',
  'testing': '🧪 Testing',
  'done': '✅ Done'
};

export const TASK_STATUS_COLORS = {
  'backlog': 'bg-slate-500/20 text-slate-400',
  'todo': 'bg-blue-500/20 text-blue-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  'in-review': 'bg-purple-500/20 text-purple-400',
  'testing': 'bg-orange-500/20 text-orange-400',
  'done': 'bg-green-500/20 text-green-400'
};

// Task Priorities
export const TASK_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const PRIORITY_LABELS = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low'
};

export const PRIORITY_COLORS = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30'
};

// Task Types
export const TASK_TYPE = {
  FEATURE: 'feature',
  BUG: 'bug',
  IMPROVEMENT: 'improvement',
  TASK: 'task',
  EPIC: 'epic'
};

export const TASK_TYPE_ICONS = {
  feature: '✨',
  bug: '🐛',
  improvement: '📈',
  task: '📋',
  epic: '🏔️'
};

// Story Points
export const STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

// Mood Values
export const MOOD_EMOJIS = {
  1: { emoji: '😫', label: 'Terrible', color: 'text-red-400' },
  2: { emoji: '😟', label: 'Bad', color: 'text-orange-400' },
  3: { emoji: '😐', label: 'Okay', color: 'text-yellow-400' },
  4: { emoji: '😊', label: 'Good', color: 'text-green-400' },
  5: { emoji: '😄', label: 'Great', color: 'text-emerald-400' }
};

// Mood Factors
export const MOOD_FACTORS = [
  { value: 'workload', label: 'Workload', icon: '📋' },
  { value: 'team-dynamics', label: 'Team Dynamics', icon: '👥' },
  { value: 'personal', label: 'Personal', icon: '🏠' },
  { value: 'unclear-requirements', label: 'Unclear Requirements', icon: '❓' },
  { value: 'technical-debt', label: 'Technical Debt', icon: '🔧' },
  { value: 'recognition', label: 'Recognition', icon: '🏆' },
  { value: 'growth', label: 'Growth Opportunities', icon: '📈' },
  { value: 'work-life-balance', label: 'Work-Life Balance', icon: '⚖️' },
  { value: 'tooling-issues', label: 'Tooling Issues', icon: '🛠️' },
  { value: 'deadline-pressure', label: 'Deadline Pressure', icon: '⏰' }
];

// Burnout Risk Levels
export const BURNOUT_LEVELS = {
  LOW: { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/20', emoji: '🟢' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20', emoji: '🟡' },
  HIGH: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20', emoji: '🟠' },
  CRITICAL: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20', emoji: '🔴' }
};

// Sidebar Navigation
export const SIDEBAR_NAV = [
  {
    section: 'MAIN',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: '/projects', label: 'Projects', icon: 'FolderKanban' },
      { path: '/my-tasks', label: 'My Tasks', icon: 'CheckSquare' }
    ]
  },
  {
    section: 'AI ENGINE',
    items: [
      { path: '/ai/workload', label: 'Workload Analysis', icon: 'Brain' },
      { path: '/team/burnout', label: 'Burnout Detection', icon: 'Flame' },
      { path: '/ai/insights', label: 'AI Insights', icon: 'Zap' },
      { path: '/standups', label: 'Auto Standups', icon: 'Bot' }
    ]
  },
  {
    section: 'WELLNESS',
    items: [
      { path: '/mood', label: 'Mood Tracker', icon: 'Heart' },
      { path: '/team', label: 'Team Members', icon: 'Users' }
    ]
  },
  {
    section: 'INSIGHTS',
    items: [
      { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
      { path: '/chat', label: 'Team Chat', icon: 'MessageSquare' }
    ]
  }
];

// App Info
export const APP_INFO = {
  name: 'WorkPulse AI',
  version: '1.0.0',
  tagline: 'Intelligent Team Productivity & Wellness Platform'
};