export { apiClient, ApiClientError } from './client'
export {
  apiGetCurrentUser,
  apiLogin,
  apiLogout,
  devLogin,
  loadStoredSession,
  login,
  logout,
  persistSession,
  register,
} from './auth.api'
export {
  forbidSuperAdminTarget,
  requireAuth,
  requireAnyPermission,
  requirePermission,
  requireRole,
} from './mock/authorization'
export {
  mockDevLoginAs,
  mockGetCurrentUser,
  mockLogin,
  mockLogout,
} from './mock/auth.mock'
export {
  mockFetchNotifications,
  mockDeleteNotification,
  mockMarkAllNotificationsRead,
  mockMarkNotificationRead,
  mockUnreadCount,
} from './mock/notifications.mock'
export { mockAiResponse, mockGlobalSearch } from './mock/search.mock'
