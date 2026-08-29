import {
  BarChart3,
  Bell,
  Calendar,
  CheckSquare,
  Clock,
  FolderOpen,
  LayoutDashboard,
  Network,
  Settings,
  Users,
  UserCog,
} from 'lucide-react'
import { ROUTES } from './routes'
import type { NavSection } from '@/shared/types'

/**
 * Main navigation sections.
 *
 * Each item's `roles` and `permissions` arrays are checked at render time.
 * Only items the current user is allowed to see are shown.
 *
 * Rule of thumb:
 *   - super_admin + admin  → management pages (employees, reports)
 *   - all roles            → personal pages (calendar, tasks, docs, settings)
 *   - super_admin only     → admin management
 */
export const MAIN_NAV: NavSection[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: ROUTES.dashboard,
        icon: LayoutDashboard,
        // Visible to all roles
      },
      {
        id: 'employees',
        label: 'Employees',
        href: ROUTES.employees,
        icon: Users,
        roles: ['super_admin', 'admin'],
        permissions: ['employees:read'],
      },
      {
        id: 'attendance',
        label: 'Attendance',
        href: ROUTES.attendance,
        icon: Clock,
        // Visible to all (employees see own records, admins see all)
        permissions: ['attendance:read_own', 'attendance:read_all'],
      },
      {
        id: 'tasks',
        label: 'Tasks',
        href: ROUTES.tasks,
        icon: CheckSquare,
        // Visible to all
        permissions: ['tasks:read_own', 'tasks:read_all'],
      },
      {
        id: 'calendar',
        label: 'Calendar',
        href: ROUTES.calendar,
        icon: Calendar,
        // Visible to all
      },
      {
        id: 'teams',
        label: 'Teams',
        href: ROUTES.teams,
        icon: Network,
        // Visible to all
      },
      {
        id: 'documents',
        label: 'Documents',
        href: ROUTES.documents,
        icon: FolderOpen,
        // Visible to all (employees read, admins can write)
        permissions: ['documents:read'],
      },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        href: ROUTES.reports,
        icon: BarChart3,
        roles: ['super_admin', 'admin'],
        permissions: ['reports:read'],
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'admin-management',
        label: 'Admin Management',
        href: ROUTES.adminManagement,
        icon: UserCog,
        // ONLY super_admin — enforced here AND in SuperAdminRoute guard
        roles: ['super_admin'],
        permissions: ['admins:create'],
      },
      {
        id: 'settings',
        label: 'Settings',
        href: ROUTES.settings,
        icon: Settings,
        // Visible to all (content differs by role)
        permissions: ['settings:profile'],
      },
    ],
  },
]

export const FOOTER_NAV = {
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    href: ROUTES.notifications,
    icon: Bell,
  },
} as const
