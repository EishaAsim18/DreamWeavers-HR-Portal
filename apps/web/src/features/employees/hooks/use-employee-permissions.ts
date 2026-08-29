import { useMemo } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import type { AssignableRole, Employee } from '../types/employee.types'

/**
 * Feature-scoped RBAC for the employees module. Mirrors the mock backend:
 * – Nobody can create a Super Admin.
 * – Only super_admin can create/edit/delete HR (admin) accounts.
 * – super_admin records are read-only for everyone.
 */
export function useEmployeePermissions() {
  const { user, is, can } = useAuth()

  return useMemo(() => {
    const isSuperAdmin = is('super_admin')

    const canManage = (target: Employee): boolean => {
      if (target.role === 'super_admin') return false
      if (target.role === 'admin' && !isSuperAdmin) return false
      return true
    }

    return {
      userId: user?.id ?? '',
      isSuperAdmin,
      canViewDirectory: can('employees:read'),
      canCreateEmployee: can('employees:write'),
      /** Creating HR (admin) accounts is exclusive to super_admin */
      canCreateHR: can('admins:create'),
      canEdit: (target: Employee) => can('employees:write') && canManage(target),
      canDelete: (target: Employee) =>
        can('employees:delete') &&
        canManage(target) &&
        (target.role !== 'admin' || can('admins:delete')) &&
        target.id !== user?.id,
      /** Roles the current user may assign in the form. super_admin is never offered. */
      assignableRoles: (isSuperAdmin
        ? ['employee', 'admin']
        : ['employee']) as AssignableRole[],
    }
  }, [user, is, can])
}
