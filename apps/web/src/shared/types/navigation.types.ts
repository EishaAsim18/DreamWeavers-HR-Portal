import type { LucideIcon } from 'lucide-react'
import type { Permission, Role } from './auth.types'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: number
  roles?: Role[]
  permissions?: Permission[]
}

export interface NavSection {
  id: string
  label?: string
  items: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
