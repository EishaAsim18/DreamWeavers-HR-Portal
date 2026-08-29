import type { Permission, Role } from '@/shared/types'

/**
 * Numeric hierarchy — higher = more privilege.
 * Used to compare roles without enumerating strings.
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 100,
  admin: 60,
  employee: 20,
}

/** Human-readable labels shown in the UI. The admin role is branded "HR". */
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'HR',
  employee: 'Employee',
}

/** Badge color variant per role (maps to Tailwind utility combos). */
export const ROLE_BADGE_CLASS: Record<Role, string> = {
  super_admin:
    'bg-[var(--dw-color-danger-muted)] text-[var(--dw-color-danger)]',
  admin:
    'bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]',
  employee:
    'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]',
}

/**
 * Canonical permission set for each role.
 * Assigned at login time; checked by both the UI and mock API handlers.
 *
 * IMPORTANT: super_admin permissions are only assigned to seeded accounts.
 * There is no UI pathway to assign these permissions.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    // Profile
    'profile:read',
    'profile:write',
    // Employees
    'employees:read',
    'employees:write',
    'employees:delete',
    // Admin management (exclusive to super_admin)
    'admins:create',
    'admins:delete',
    // Attendance
    'attendance:read_own',
    'attendance:submit',
    'attendance:read_all',
    'attendance:manage',
    // Tasks
    'tasks:read_own',
    'tasks:update_own',
    'tasks:read_all',
    'tasks:write',
    'tasks:delete',
    // Teams
    'teams:read',
    'teams:write',
    'teams:delete',
    // Reports
    'reports:read',
    'reports:export',
    // Documents
    'documents:read',
    'documents:write',
    // Settings
    'settings:profile',
    'settings:org',
    'settings:system',
    // Automations
    'automations:read',
    'automations:write',
  ],

  admin: [
    // Profile
    'profile:read',
    'profile:write',
    // Employees (manage but cannot touch super_admin accounts)
    'employees:read',
    'employees:write',
    'employees:delete',
    // Attendance
    'attendance:read_own',
    'attendance:submit',
    'attendance:read_all',
    'attendance:manage',
    // Tasks
    'tasks:read_own',
    'tasks:update_own',
    'tasks:read_all',
    'tasks:write',
    'tasks:delete',
    // Teams
    'teams:read',
    'teams:write',
    'teams:delete',
    // Reports
    'reports:read',
    'reports:export',
    // Documents
    'documents:read',
    'documents:write',
    // Settings
    'settings:profile',
    'settings:org',
    // Automations
    'automations:read',
    'automations:write',
    // ⚠️  admins:create and admins:delete are intentionally absent
    // ⚠️  settings:system is intentionally absent
  ],

  employee: [
    // Profile
    'profile:read',
    'profile:write',
    // Attendance (own only)
    'attendance:read_own',
    'attendance:submit',
    // Tasks (own only)
    'tasks:read_own',
    'tasks:update_own',
    // Teams (view rosters only — no manage rights)
    'teams:read',
    // Documents (read shared)
    'documents:read',
    // Settings (personal only)
    'settings:profile',
    // ⚠️  No employees:*, reports:*, automations:*, settings:org/system
  ],
}

// ── Authorization helpers ─────────────────────────────────────────────────

/** True if the user's role is in the allowed list. */
export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole)
}

/** True if the user's role is at least as privileged as the minimum. */
export function hasMinRole(userRole: Role, minRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]
}

/** True if the user holds a specific permission. */
export function hasPermission(
  userPermissions: Permission[],
  required: Permission,
): boolean {
  return userPermissions.includes(required)
}

/** True if the user holds ANY of the listed permissions. */
export function hasAnyPermission(
  userPermissions: Permission[],
  required: Permission[],
): boolean {
  return required.some((p) => userPermissions.includes(p))
}

/** True if the user holds ALL of the listed permissions. */
export function hasAllPermissions(
  userPermissions: Permission[],
  required: Permission[],
): boolean {
  return required.every((p) => userPermissions.includes(p))
}
