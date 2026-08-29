/**
 * Employees Mock Backend
 *
 * Simulates a real REST API for the employee directory.
 * – Full CRUD with strict RBAC enforcement
 * – localStorage persistence so data survives page refreshes
 * – Realistic network delays via sleep()
 * – In-process notification bus (notification bell feed)
 *
 * RBAC rules (mirrored in the UI, enforced here as the source of truth):
 * – Only admin (HR) and super_admin can read the directory.
 * – NOBODY can create a super_admin account — it exists only via seed.
 * – Only super_admin can create/update/delete HR (admin) accounts.
 * – super_admin accounts can never be modified or deleted.
 */

import { STORAGE_KEYS } from '@/shared/constants'
import { sleep } from '@/shared/lib/utils'
import { AuthorizationError } from '@/shared/types'
import type { User } from '@/shared/types'
import { MOCK_EMPLOYEES } from '@/features/employees/data/employees.mock'
import {
  pickAvatarColor,
  employeeFullName,
  type Employee,
  type EmployeeFormData,
} from '@/features/employees/types/employee.types'
import {
  requireAuth,
  requirePermission,
  forbidSuperAdminTarget,
} from './authorization'

// ── Notifications bus ─────────────────────────────────────────────────────────

import { MOCK_NOTIFICATIONS } from '@/shared/data/mock'
import type { Notification } from '@/shared/types'

let _notifId = 500
function pushNotification(notif: Omit<Notification, 'id' | 'read' | 'createdAt'>): void {
  const n: Notification = {
    ...notif,
    id: `notif_emp_${++_notifId}`,
    read: false,
    createdAt: new Date().toISOString(),
  }
  ;(MOCK_NOTIFICATIONS as Notification[]).unshift(n)
}

// ── Persistence ───────────────────────────────────────────────────────────────

function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.employees)
    if (raw) return JSON.parse(raw) as Employee[]
  } catch {
    // ignore corrupt data
  }
  return [...MOCK_EMPLOYEES]
}

function saveEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees))
  } catch {
    // ignore quota errors
  }
}

let _employees: Employee[] = loadEmployees()
let _idSeq = 1000

// ── RBAC helpers ──────────────────────────────────────────────────────────────

/** Server-side gate for creating/promoting accounts with a given role. */
function assertCanAssignRole(user: User, role: Employee['role']): void {
  if (role === 'super_admin') {
    // Hard rule: nobody — not even the super admin — can mint a super_admin.
    throw new AuthorizationError(
      'Super Admin accounts cannot be created or assigned. They exist only via system seed.',
    )
  }
  if (role === 'admin') {
    // Only super_admin holds admins:create
    requirePermission(user, 'admins:create')
  }
}

/** Only super_admin may touch HR (admin) records. */
function assertCanManageTarget(user: User, target: Employee): void {
  forbidSuperAdminTarget(target.role)
  if (target.role === 'admin' && user.role !== 'super_admin') {
    throw new AuthorizationError('Only the Super Admin can manage HR accounts.')
  }
}

function assertEmailAvailable(email: string, excludeId?: string): void {
  const normalized = email.trim().toLowerCase()
  const clash = _employees.find(
    (e) => e.email.toLowerCase() === normalized && e.id !== excludeId,
  )
  if (clash) {
    throw new AuthorizationError(`An account with ${email} already exists.`)
  }
}

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * Called by the self-registration flow (`mockRegister` in `auth.mock.ts`) to
 * add the newly-signed-up person straight into the directory. Deliberately
 * unauthenticated/unpermissioned — this is the system creating the signer's
 * own record at signup, not a privileged employee-management action.
 */
export function registerSelfAsEmployee(input: {
  id: string
  firstName: string
  lastName: string
  email: string
}): Employee {
  _employees = loadEmployees()
  const now = new Date().toISOString()
  const employee: Employee = {
    id: input.id,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: '',
    role: 'employee',
    department: 'General',
    jobTitle: 'New Team Member',
    status: 'active',
    joinDate: now.slice(0, 10),
    location: 'Remote',
    avatarColor: pickAvatarColor(input.email),
    createdAt: now,
    updatedAt: now,
  }

  _employees = [employee, ..._employees]
  saveEmployees(_employees)

  pushNotification({
    category: 'system',
    title: 'New teammate joined',
    description: `${employeeFullName(employee)} just created an account and joined the directory.`,
    href: '/employees',
  })

  return employee
}

export async function mockFetchEmployees(user: User | null): Promise<Employee[]> {
  await sleep(400)
  requireAuth(user)
  requirePermission(user, 'employees:read')
  _employees = loadEmployees()
  return [..._employees]
}

export async function mockCreateEmployee(
  user: User | null,
  data: EmployeeFormData,
): Promise<Employee> {
  await sleep(500)
  requireAuth(user)
  requirePermission(user, 'employees:write')
  assertCanAssignRole(user, data.role)
  assertEmailAvailable(data.email)

  const now = new Date().toISOString()
  const employee: Employee = {
    ...data,
    id: `usr_new_${++_idSeq}`,
    email: data.email.trim().toLowerCase(),
    avatarColor: pickAvatarColor(data.email),
    createdAt: now,
    updatedAt: now,
  }

  _employees = [employee, ..._employees]
  saveEmployees(_employees)

  pushNotification({
    category: 'system',
    title: data.role === 'admin' ? 'New HR account created' : 'New employee added',
    description: `${employeeFullName(employee)} joined ${employee.department} as ${employee.jobTitle}.`,
    href: '/employees',
  })

  return employee
}

export async function mockUpdateEmployee(
  user: User | null,
  id: string,
  updates: Partial<EmployeeFormData>,
): Promise<Employee> {
  await sleep(450)
  requireAuth(user)
  requirePermission(user, 'employees:write')

  const target = _employees.find((e) => e.id === id)
  if (!target) throw new AuthorizationError('Employee not found.')

  assertCanManageTarget(user, target)

  if (updates.role && updates.role !== target.role) {
    assertCanAssignRole(user, updates.role)
  }
  if (updates.email && updates.email !== target.email) {
    assertEmailAvailable(updates.email, id)
  }

  const updated: Employee = {
    ...target,
    ...updates,
    email: (updates.email ?? target.email).trim().toLowerCase(),
    updatedAt: new Date().toISOString(),
  }

  _employees = _employees.map((e) => (e.id === id ? updated : e))
  saveEmployees(_employees)

  pushNotification({
    category: 'system',
    title: 'Employee profile updated',
    description: `${employeeFullName(updated)}'s record was updated by ${user.firstName}.`,
    href: '/employees',
  })

  return updated
}

export async function mockDeleteEmployee(user: User | null, id: string): Promise<void> {
  await sleep(450)
  requireAuth(user)
  requirePermission(user, 'employees:delete')

  const target = _employees.find((e) => e.id === id)
  if (!target) throw new AuthorizationError('Employee not found.')

  forbidSuperAdminTarget(target.role)
  if (target.role === 'admin') {
    // Only super_admin holds admins:delete
    requirePermission(user, 'admins:delete')
  }

  _employees = _employees.filter((e) => e.id !== id)
  saveEmployees(_employees)

  pushNotification({
    category: 'system',
    title: target.role === 'admin' ? 'HR account removed' : 'Employee removed',
    description: `${employeeFullName(target)} was removed from the directory by ${user.firstName}.`,
    href: '/employees',
  })
}
