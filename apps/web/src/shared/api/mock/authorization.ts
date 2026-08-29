/**
 * Mock server-side authorization utilities.
 *
 * In production these checks live in the backend (middleware / service layer).
 * Here they are replicated in the mock API so the frontend authorization model
 * is fully exercised during development.
 */

import { AuthorizationError } from '@/shared/types'
import type { Permission, Role, User } from '@/shared/types'
import { hasAnyPermission, hasPermission, hasRole } from '@/shared/constants'

/** Assert the caller is authenticated. */
export function requireAuth(user: User | null): asserts user is User {
  if (!user) {
    throw new AuthorizationError('Not authenticated.')
  }
}

/** Assert the caller holds a specific permission. */
export function requirePermission(user: User | null, permission: Permission): void {
  requireAuth(user)
  if (!hasPermission(user.permissions, permission)) {
    throw new AuthorizationError(
      `Your role (${user.role}) does not have permission: ${permission}.`,
    )
  }
}

/** Assert the caller holds ANY of the listed permissions. */
export function requireAnyPermission(user: User | null, permissions: Permission[]): void {
  requireAuth(user)
  if (!hasAnyPermission(user.permissions, permissions)) {
    throw new AuthorizationError(
      `Your role (${user.role}) requires one of: ${permissions.join(', ')}.`,
    )
  }
}

/** Assert the caller's role is in the allowed list. */
export function requireRole(user: User | null, roles: Role[]): void {
  requireAuth(user)
  if (!hasRole(user.role, roles)) {
    throw new AuthorizationError(
      `This action requires one of these roles: ${roles.join(', ')}. You are: ${user.role}.`,
    )
  }
}

/**
 * Assert that the target account is not a super_admin.
 * Admins may never modify super_admin accounts — enforced both in UI and here.
 */
export function forbidSuperAdminTarget(targetRole: Role): void {
  if (targetRole === 'super_admin') {
    throw new AuthorizationError(
      'Super admin accounts cannot be modified or deleted through the application.',
    )
  }
}
