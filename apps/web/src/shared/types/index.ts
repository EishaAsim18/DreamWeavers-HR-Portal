export type { AuthSession, LoginCredentials, Permission, RegisterInput, Role, User } from './auth.types'
export { AuthorizationError } from './auth.types'
export type { BreadcrumbItem, NavItem, NavSection } from './navigation.types'
export type {
  AiMessage,
  CommandItem,
  Notification,
  NotificationAction,
  NotificationCategory,
  SearchResult,
} from './notification.types'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
