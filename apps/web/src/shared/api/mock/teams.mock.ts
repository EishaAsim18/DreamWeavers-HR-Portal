/**
 * Teams Mock Backend
 *
 * Simulates a real REST API for team roster management.
 * – Full CRUD for teams + members with RBAC enforcement
 * – localStorage persistence so data survives page refreshes
 * – Realistic network delays via sleep()
 * – In-process notification bus (notification bell feed)
 *
 * RBAC rules (mirrored in the UI, enforced here as the source of truth):
 * – Everyone (teams:read) can view all team rosters.
 * – Only admin (HR) and super_admin (teams:write) can create teams, add/remove
 *   members, and reassign the manager.
 * – Only admin/super_admin (teams:delete) can delete a team; an admin may not
 *   delete a team whose manager is a super_admin.
 * – Every team must always have exactly one manager, present in `members`.
 */

import { STORAGE_KEYS } from '@/shared/constants'
import { sleep } from '@/shared/lib/utils'
import { AuthorizationError } from '@/shared/types'
import type { User } from '@/shared/types'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import { MOCK_TEAMS } from '@/features/teams/data/teams.mock'
import { MANAGER_ROLE_LABEL, DEFAULT_MEMBER_ROLE_LABEL } from '@/features/teams/types/team.types'
import type { Team, TeamFormData, TeamMemberFormData } from '@/features/teams/types/team.types'
import { requireAuth, requirePermission } from './authorization'

// ── Notifications bus ─────────────────────────────────────────────────────────

import { MOCK_NOTIFICATIONS } from '@/shared/data/mock'
import type { Notification } from '@/shared/types'

let _notifId = 700
function pushNotification(notif: Omit<Notification, 'id' | 'read' | 'createdAt'>): void {
  const n: Notification = {
    ...notif,
    id: `notif_team_${++_notifId}`,
    read: false,
    createdAt: new Date().toISOString(),
  }
  ;(MOCK_NOTIFICATIONS as Notification[]).unshift(n)
}

// ── Persistence ───────────────────────────────────────────────────────────────

function loadTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.teams)
    if (raw) return JSON.parse(raw) as Team[]
  } catch {
    // ignore corrupt data
  }
  return [...MOCK_TEAMS]
}

function saveTeams(teams: Team[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams))
  } catch {
    // ignore quota errors
  }
}

let _teams: Team[] = loadTeams()

// ── RBAC / validation helpers ─────────────────────────────────────────────────

function assertCanDeleteTeam(user: User, team: Team): void {
  if (user.role === 'super_admin') return
  const manager = getPerson(team.managerId)
  if (manager?.role === 'super_admin') {
    throw new AuthorizationError('Only the Super Admin can delete a team they manage.')
  }
}

function assertEmployeeExists(employeeId: string): void {
  if (!getPerson(employeeId)) {
    throw new AuthorizationError('That employee could not be found.')
  }
}

function personName(id: string): string {
  return getPerson(id)?.name ?? id
}

// ── Handlers ──────────────────────────────────────────────────────────────────

/** Fetch every team roster. Visible to all authenticated users. */
export async function mockFetchTeams(user: User | null): Promise<Team[]> {
  await sleep(350)
  requireAuth(user)
  requirePermission(user, 'teams:read')
  _teams = loadTeams()
  return [..._teams]
}

/** Create a new team. The chosen manager is auto-added as the first member. */
export async function mockCreateTeam(user: User | null, data: TeamFormData): Promise<Team> {
  await sleep(450)
  requireAuth(user)
  requirePermission(user, 'teams:write')
  assertEmployeeExists(data.managerId)

  if (!data.name.trim()) {
    throw new AuthorizationError('A team name is required.')
  }

  const now = new Date().toISOString()
  const team: Team = {
    id: `team_${Date.now()}`,
    name: data.name.trim(),
    description: data.description.trim(),
    color: data.color,
    managerId: data.managerId,
    members: [{ employeeId: data.managerId, role: MANAGER_ROLE_LABEL, joinedAt: now }],
    createdAt: now,
    updatedAt: now,
  }

  _teams = [team, ..._teams]
  saveTeams(_teams)

  pushNotification({
    category: 'system',
    title: 'New team created',
    description: `${team.name} was created by ${user.firstName}, managed by ${personName(data.managerId)}.`,
    href: '/teams',
  })

  return team
}

/** Update a team's name / description / color. Manager changes go through `mockChangeManager`. */
export async function mockUpdateTeam(
  user: User | null,
  id: string,
  updates: Partial<Pick<TeamFormData, 'name' | 'description' | 'color'>>,
): Promise<Team> {
  await sleep(400)
  requireAuth(user)
  requirePermission(user, 'teams:write')

  const target = _teams.find((t) => t.id === id)
  if (!target) throw new AuthorizationError('Team not found.')

  const updated: Team = {
    ...target,
    ...updates,
    name: (updates.name ?? target.name).trim(),
    description: (updates.description ?? target.description).trim(),
    updatedAt: new Date().toISOString(),
  }

  _teams = _teams.map((t) => (t.id === id ? updated : t))
  saveTeams(_teams)
  return updated
}

/** Delete a team entirely. */
export async function mockDeleteTeam(user: User | null, id: string): Promise<void> {
  await sleep(400)
  requireAuth(user)
  requirePermission(user, 'teams:delete')

  const target = _teams.find((t) => t.id === id)
  if (!target) throw new AuthorizationError('Team not found.')

  assertCanDeleteTeam(user, target)

  _teams = _teams.filter((t) => t.id !== id)
  saveTeams(_teams)

  pushNotification({
    category: 'system',
    title: 'Team deleted',
    description: `${target.name} was deleted by ${user.firstName}.`,
    href: '/teams',
  })
}

/** Add an existing employee to a team's roster. */
export async function mockAddMember(
  user: User | null,
  teamId: string,
  member: TeamMemberFormData,
): Promise<Team> {
  await sleep(400)
  requireAuth(user)
  requirePermission(user, 'teams:write')

  const target = _teams.find((t) => t.id === teamId)
  if (!target) throw new AuthorizationError('Team not found.')

  assertEmployeeExists(member.employeeId)

  if (target.members.some((m) => m.employeeId === member.employeeId)) {
    throw new AuthorizationError('This person is already on the team.')
  }

  const updated: Team = {
    ...target,
    members: [
      ...target.members,
      {
        employeeId: member.employeeId,
        role: member.role.trim() || DEFAULT_MEMBER_ROLE_LABEL,
        joinedAt: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  }

  _teams = _teams.map((t) => (t.id === teamId ? updated : t))
  saveTeams(_teams)

  pushNotification({
    category: 'system',
    title: 'Team member added',
    description: `${personName(member.employeeId)} joined ${target.name}.`,
    href: '/teams',
  })

  return updated
}

/** Remove a member from a team. The current manager cannot be removed directly. */
export async function mockRemoveMember(
  user: User | null,
  teamId: string,
  employeeId: string,
): Promise<Team> {
  await sleep(350)
  requireAuth(user)
  requirePermission(user, 'teams:write')

  const target = _teams.find((t) => t.id === teamId)
  if (!target) throw new AuthorizationError('Team not found.')

  if (target.managerId === employeeId) {
    throw new AuthorizationError('Assign a new manager before removing this person.')
  }

  const updated: Team = {
    ...target,
    members: target.members.filter((m) => m.employeeId !== employeeId),
    updatedAt: new Date().toISOString(),
  }

  _teams = _teams.map((t) => (t.id === teamId ? updated : t))
  saveTeams(_teams)

  pushNotification({
    category: 'system',
    title: 'Team member removed',
    description: `${personName(employeeId)} was removed from ${target.name} by ${user.firstName}.`,
    href: '/teams',
  })

  return updated
}

/** Reassign the team's manager. The previous manager stays on as a regular member. */
export async function mockChangeManager(
  user: User | null,
  teamId: string,
  newManagerId: string,
): Promise<Team> {
  await sleep(400)
  requireAuth(user)
  requirePermission(user, 'teams:write')

  const target = _teams.find((t) => t.id === teamId)
  if (!target) throw new AuthorizationError('Team not found.')

  assertEmployeeExists(newManagerId)

  if (target.managerId === newManagerId) return target

  const alreadyMember = target.members.some((m) => m.employeeId === newManagerId)
  const now = new Date().toISOString()

  const members = alreadyMember
    ? target.members.map((m) =>
        m.employeeId === newManagerId
          ? { ...m, role: MANAGER_ROLE_LABEL }
          : m.employeeId === target.managerId
            ? { ...m, role: DEFAULT_MEMBER_ROLE_LABEL }
            : m,
      )
    : [
        ...target.members.map((m) =>
          m.employeeId === target.managerId ? { ...m, role: DEFAULT_MEMBER_ROLE_LABEL } : m,
        ),
        { employeeId: newManagerId, role: MANAGER_ROLE_LABEL, joinedAt: now },
      ]

  const updated: Team = {
    ...target,
    managerId: newManagerId,
    members,
    updatedAt: now,
  }

  _teams = _teams.map((t) => (t.id === teamId ? updated : t))
  saveTeams(_teams)

  pushNotification({
    category: 'system',
    title: 'Team manager changed',
    description: `${personName(newManagerId)} is now managing ${target.name}.`,
    href: '/teams',
  })

  return updated
}

/** Update a member's role label within the team. */
export async function mockUpdateMemberRole(
  user: User | null,
  teamId: string,
  employeeId: string,
  role: string,
): Promise<Team> {
  await sleep(300)
  requireAuth(user)
  requirePermission(user, 'teams:write')

  const target = _teams.find((t) => t.id === teamId)
  if (!target) throw new AuthorizationError('Team not found.')

  const trimmed = role.trim() || DEFAULT_MEMBER_ROLE_LABEL
  const isManager = target.managerId === employeeId

  const updated: Team = {
    ...target,
    members: target.members.map((m) =>
      m.employeeId === employeeId ? { ...m, role: isManager ? MANAGER_ROLE_LABEL : trimmed } : m,
    ),
    updatedAt: new Date().toISOString(),
  }

  _teams = _teams.map((t) => (t.id === teamId ? updated : t))
  saveTeams(_teams)
  return updated
}

/** Reset all team data to initial mock data. */
export function mockResetTeamsData(): void {
  _teams = [...MOCK_TEAMS]
  saveTeams(_teams)
}
