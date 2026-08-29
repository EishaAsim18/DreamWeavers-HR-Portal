import type { Role } from '@dreamweavers/database'

export type Permission =
  | 'profile:read'
  | 'profile:write'
  | 'employees:read'
  | 'employees:write'
  | 'employees:delete'
  | 'admins:create'
  | 'admins:delete'
  | 'attendance:read_own'
  | 'attendance:submit'
  | 'attendance:read_all'
  | 'attendance:manage'
  | 'tasks:read_own'
  | 'tasks:update_own'
  | 'tasks:read_all'
  | 'tasks:write'
  | 'tasks:delete'
  | 'teams:read'
  | 'teams:write'
  | 'teams:delete'
  | 'reports:read'
  | 'reports:export'
  | 'documents:read'
  | 'documents:write'
  | 'settings:profile'
  | 'settings:org'
  | 'settings:system'
  | 'automations:read'
  | 'automations:write'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'profile:read', 'profile:write',
    'employees:read', 'employees:write', 'employees:delete',
    'admins:create', 'admins:delete',
    'attendance:read_own', 'attendance:submit', 'attendance:read_all', 'attendance:manage',
    'tasks:read_own', 'tasks:update_own', 'tasks:read_all', 'tasks:write', 'tasks:delete',
    'teams:read', 'teams:write', 'teams:delete',
    'reports:read', 'reports:export',
    'documents:read', 'documents:write',
    'settings:profile', 'settings:org', 'settings:system',
    'automations:read', 'automations:write',
  ],
  admin: [
    'profile:read', 'profile:write',
    'employees:read', 'employees:write', 'employees:delete',
    'attendance:read_own', 'attendance:submit', 'attendance:read_all', 'attendance:manage',
    'tasks:read_own', 'tasks:update_own', 'tasks:read_all', 'tasks:write', 'tasks:delete',
    'teams:read', 'teams:write', 'teams:delete',
    'reports:read', 'reports:export',
    'documents:read', 'documents:write',
    'settings:profile', 'settings:org',
    'automations:read', 'automations:write',
  ],
  employee: [
    'profile:read', 'profile:write',
    'attendance:read_own', 'attendance:submit',
    'tasks:read_own', 'tasks:update_own',
    'teams:read',
    'documents:read',
    'settings:profile',
  ],
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(permissions: Permission[], required: Permission): boolean {
  return permissions.includes(required)
}

export function hasAnyPermission(permissions: Permission[], required: Permission[]): boolean {
  return required.some((p) => permissions.includes(p))
}
