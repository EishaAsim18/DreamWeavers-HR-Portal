export const APP_NAME = 'DreamWeavers'
export const APP_FULL_NAME = 'DreamWeavers HRMS'

export const STORAGE_KEYS = {
  theme: 'dw-theme',
  sidebarCollapsed: 'dw-sidebar-collapsed',
  authSession: 'dw-auth-session',
  recentCommands: 'dw-recent-commands',
  recentSearches: 'dw-recent-searches',
  calendarTasks: 'dw-calendar-tasks',
  employees: 'dw-employees',
  todoList: 'dw-todo-list',
  goals: 'dw-goals',
  teams: 'dw-teams',
  meetDreams: 'dw-meet-dreams',
  meetDreamsRead: 'dw-meet-dreams-read',
  registeredUsers: 'dw-registered-users',
} as const

export const QUERY_KEYS = {
  auth: ['auth'] as const,
  notifications: ['notifications'] as const,
  search: (query: string) => ['search', query] as const,
} as const

export const ANIMATION = {
  fast: 0.1,
  normal: 0.15,
  slow: 0.2,
  slower: 0.3,
  spring: { type: 'spring' as const, stiffness: 400, damping: 30 },
  panelSpring: { type: 'spring' as const, stiffness: 300, damping: 28 },
} as const
