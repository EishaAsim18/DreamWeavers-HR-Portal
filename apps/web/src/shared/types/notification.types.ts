import type { LucideIcon } from 'lucide-react'

export type NotificationCategory =
  | 'approval'
  | 'task'
  | 'mention'
  | 'attendance'
  | 'document'
  | 'meeting'
  | 'system'
  | 'automation'

export interface Notification {
  id: string
  category: NotificationCategory
  title: string
  description: string
  createdAt: string
  read: boolean
  href?: string
  actions?: NotificationAction[]
}

export interface NotificationAction {
  id: string
  label: string
  variant: 'primary' | 'secondary' | 'ghost'
}

export interface SearchResult {
  id: string
  type: 'person' | 'task' | 'document' | 'message' | 'page'
  title: string
  subtitle?: string
  href: string
  meta?: string
}

export interface CommandItem {
  id: string
  label: string
  group: 'recent' | 'navigation' | 'action' | 'people' | 'ai'
  keywords?: string[]
  href?: string
  action?: () => void
  icon?: LucideIcon
}

export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}
