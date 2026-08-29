/**
 * Three-tier role hierarchy.
 *
 * super_admin — seeded only via database/initialization. NEVER created through UI.
 * admin       — created/removed only by super_admin. Manages employees.
 * employee    — accesses only own data and assigned work.
 */
export type Role = 'super_admin' | 'admin' | 'employee'

/**
 * Fine-grained permissions. Each role maps to a fixed set.
 * Components and mock API handlers check these — never raw role strings.
 */
export type Permission =
  // ── Profile ────────────────────────────────────────────
  | 'profile:read'        // Own profile (all roles)
  | 'profile:write'       // Edit own profile (all roles)
  // ── Employee directory ─────────────────────────────────
  | 'employees:read'      // View full employee list (admin+)
  | 'employees:write'     // Create / edit employees (admin+)
  | 'employees:delete'    // Deactivate / delete employees (admin+)
  // ── Admin management (super_admin only) ────────────────
  | 'admins:create'       // Invite a new admin account
  | 'admins:delete'       // Remove an admin account
  // ── Attendance ─────────────────────────────────────────
  | 'attendance:read_own'  // View own records (all)
  | 'attendance:submit'    // Submit own clock-in/out (all)
  | 'attendance:read_all'  // View all employees' records (admin+)
  | 'attendance:manage'    // Approve / correct attendance (admin+)
  // ── Tasks ──────────────────────────────────────────────
  | 'tasks:read_own'      // View own assigned tasks (all)
  | 'tasks:update_own'    // Update status of own tasks (all)
  | 'tasks:read_all'      // View all tasks (admin+)
  | 'tasks:write'         // Create / assign tasks (admin+)
  | 'tasks:delete'        // Delete tasks (admin+)
  // ── Teams ──────────────────────────────────────────────
  | 'teams:read'          // View team rosters (all)
  | 'teams:write'         // Create teams, add/remove members, change manager (admin+)
  | 'teams:delete'        // Delete a team (admin+)
  // ── Reports ────────────────────────────────────────────
  | 'reports:read'        // View analytics reports (admin+)
  | 'reports:export'      // Export report data (admin+)
  // ── Documents ──────────────────────────────────────────
  | 'documents:read'      // View shared documents (all)
  | 'documents:write'     // Upload / manage documents (admin+)
  // ── Settings ───────────────────────────────────────────
  | 'settings:profile'    // Personal preferences (all)
  | 'settings:org'        // Organisation settings (admin+)
  | 'settings:system'     // System-level settings (super_admin only)
  // ── Automations ────────────────────────────────────────
  | 'automations:read'    // View automations (admin+)
  | 'automations:write'   // Create / edit automations (admin+)

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: Role
  permissions: Permission[]
  department?: string
  jobTitle?: string
}

export interface AuthSession {
  user: User
  accessToken: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

/** Self-registration — anyone can create an account, WhatsApp-style. Always
 * lands as an 'employee'; admins can promote/edit them afterward. */
export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

/** Thrown by mock API when the authenticated user lacks permission. */
export class AuthorizationError extends Error {
  readonly code = 'FORBIDDEN'
  constructor(message = 'You do not have permission to perform this action.') {
    super(message)
    this.name = 'AuthorizationError'
  }
}
