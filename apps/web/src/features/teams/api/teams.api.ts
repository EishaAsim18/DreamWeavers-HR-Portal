/**
 * Teams API client.
 *
 * A thin typed wrapper around the mock backend handlers.
 * When a real backend is ready, swap these implementations for real fetch() calls
 * — the rest of the application stays unchanged.
 */

import { useAuth } from '@/shared/hooks/use-auth'
import {
  mockFetchTeams,
  mockCreateTeam,
  mockUpdateTeam,
  mockDeleteTeam,
  mockAddMember,
  mockRemoveMember,
  mockChangeManager,
  mockUpdateMemberRole,
} from '@/shared/api/mock/teams.mock'
import type { TeamFormData, TeamMemberFormData } from '../types/team.types'
import type { User } from '@/shared/types'

// ── Raw API functions (pass user explicitly) ──────────────────────────────────

export const teamsApi = {
  fetchTeams: (user: User) => mockFetchTeams(user),
  createTeam: (user: User, data: TeamFormData) => mockCreateTeam(user, data),
  updateTeam: (user: User, id: string, updates: Partial<Pick<TeamFormData, 'name' | 'description' | 'color'>>) =>
    mockUpdateTeam(user, id, updates),
  deleteTeam: (user: User, id: string) => mockDeleteTeam(user, id),
  addMember: (user: User, teamId: string, member: TeamMemberFormData) =>
    mockAddMember(user, teamId, member),
  removeMember: (user: User, teamId: string, employeeId: string) =>
    mockRemoveMember(user, teamId, employeeId),
  changeManager: (user: User, teamId: string, newManagerId: string) =>
    mockChangeManager(user, teamId, newManagerId),
  updateMemberRole: (user: User, teamId: string, employeeId: string, role: string) =>
    mockUpdateMemberRole(user, teamId, employeeId, role),
} as const

// ── Hook: bound to current session ───────────────────────────────────────────

/** Returns API methods pre-bound to the currently authenticated user. */
export function useTeamsApi() {
  const { user } = useAuth()

  if (!user) throw new Error('useTeamsApi must be used when authenticated')

  return {
    fetchTeams: () => teamsApi.fetchTeams(user),
    createTeam: (data: TeamFormData) => teamsApi.createTeam(user, data),
    updateTeam: (id: string, updates: Partial<Pick<TeamFormData, 'name' | 'description' | 'color'>>) =>
      teamsApi.updateTeam(user, id, updates),
    deleteTeam: (id: string) => teamsApi.deleteTeam(user, id),
    addMember: (teamId: string, member: TeamMemberFormData) => teamsApi.addMember(user, teamId, member),
    removeMember: (teamId: string, employeeId: string) => teamsApi.removeMember(user, teamId, employeeId),
    changeManager: (teamId: string, newManagerId: string) => teamsApi.changeManager(user, teamId, newManagerId),
    updateMemberRole: (teamId: string, employeeId: string, role: string) =>
      teamsApi.updateMemberRole(user, teamId, employeeId, role),
  }
}
