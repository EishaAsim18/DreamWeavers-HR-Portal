// ── Core types ────────────────────────────────────────────────────────────────

/** A person's standing within a team roster. */
export interface TeamMember {
  employeeId: string
  /** Role/title within THIS team — separate from their org-wide job title. */
  role: string
  joinedAt: string
}

export interface Team {
  id: string
  name: string
  description: string
  color: string
  /** Employee id of the team's single manager. Always present in `members`. */
  managerId: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}

export interface TeamFormData {
  name: string
  description: string
  color: string
  /** Only used at creation time — change manager afterwards via `changeManager`. */
  managerId: string
}

export interface TeamMemberFormData {
  employeeId: string
  role: string
}

export type TeamsViewMode = 'grid' | 'list'

// ── Display configs ───────────────────────────────────────────────────────────

export const TEAM_COLORS = [
  '#4a7c92',
  '#7c3aed',
  '#0891b2',
  '#10b981',
  '#f97316',
  '#e11d48',
  '#9333ea',
  '#65a30d',
] as const

export const MANAGER_ROLE_LABEL = 'Manager'
export const DEFAULT_MEMBER_ROLE_LABEL = 'Member'
