import { useAuth } from '@/shared/hooks/use-auth'
import { hasPermission } from '@/shared/constants'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import type { Team } from '../types/team.types'

/**
 * RBAC permission hook for the Teams module.
 * Everyone can view team rosters; only admin/super_admin can manage them.
 */
export function useTeamPermissions() {
  const { user } = useAuth()
  const role = user?.role

  const canViewTeams = !!user && hasPermission(user.permissions, 'teams:read')
  const canManageTeams = !!user && hasPermission(user.permissions, 'teams:write')

  /** Admin cannot delete a team managed by a super_admin. Super admin can delete any. */
  const canDeleteTeam = (team: Team): boolean => {
    if (!user || !hasPermission(user.permissions, 'teams:delete')) return false
    if (role === 'super_admin') return true
    const manager = getPerson(team.managerId)
    return manager?.role !== 'super_admin'
  }

  const canEditTeam = (team: Team): boolean => canManageTeams && canDeleteTeam(team)

  return {
    role,
    userId: user?.id,
    canViewTeams,
    canManageTeams,
    canDeleteTeam,
    canEditTeam,
  }
}
