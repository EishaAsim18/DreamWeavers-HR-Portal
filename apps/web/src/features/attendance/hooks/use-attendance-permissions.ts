import { useMemo } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'

export function useAttendancePermissions() {
  const { user, can, is } = useAuth()

  return useMemo(
    () => ({
      userId: user?.id ?? '',
      role: user?.role ?? 'employee',
      canViewOwn: can('attendance:read_own'),
      canViewAll: can('attendance:read_all'),
      canSubmit: can('attendance:submit'),
      canManage: can('attendance:manage'),
      isAdmin: is('super_admin', 'admin'),
    }),
    [user, can, is],
  )
}
