import type { Role } from '@/shared/types'

// ── Core types ────────────────────────────────────────────────────────────────

export type EmployeeStatus = 'active' | 'on_leave' | 'inactive'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  /** 'super_admin' exists only via DB seed — never creatable through the app */
  role: Role
  department: string
  jobTitle: string
  status: EmployeeStatus
  /** ISO date */
  joinDate: string
  location: string
  avatarColor: string
  createdAt: string
  updatedAt: string
}

/** Roles that can be assigned through the app. super_admin is intentionally absent. */
export type AssignableRole = Extract<Role, 'admin' | 'employee'>

export interface EmployeeFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: AssignableRole
  department: string
  jobTitle: string
  status: EmployeeStatus
  joinDate: string
  location: string
}

export interface EmployeeFilters {
  query: string
  departments: string[]
  roles: Role[]
  statuses: EmployeeStatus[]
}

export type EmployeesViewMode = 'grid' | 'table'

// ── Display configs ───────────────────────────────────────────────────────────

export const DEPARTMENTS = [
  'Executive',
  'Human Resources',
  'Engineering',
  'Design',
  'Product',
  'Operations',
  'DevOps',
  'Finance',
  'Marketing',
] as const

export const EMPLOYEE_STATUS_CONFIG: Record<
  EmployeeStatus,
  { label: string; dot: string; chip: string }
> = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  on_leave: {
    label: 'On Leave',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-slate-400',
    chip: 'bg-slate-100 text-slate-500 border-slate-200',
  },
}

/** Role display config for the employees module (admin is shown as "HR"). */
export const EMPLOYEE_ROLE_CONFIG: Record<
  Role,
  { label: string; icon: string; chip: string; accent: string }
> = {
  super_admin: {
    label: 'Super Admin',
    icon: '👑',
    chip: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: '#e11d48',
  },
  admin: {
    label: 'HR',
    icon: '🛡️',
    chip: 'bg-violet-50 text-violet-700 border-violet-200',
    accent: '#7c3aed',
  },
  employee: {
    label: 'Employee',
    icon: '👤',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    accent: '#0284c7',
  },
}

export const AVATAR_COLORS = [
  '#4a7c92',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#e11d48',
  '#0891b2',
  '#db2777',
  '#65a30d',
  '#9333ea',
  '#0284c7',
] as const

export function pickAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function employeeInitials(e: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${e.firstName[0] ?? ''}${e.lastName[0] ?? ''}`.toUpperCase()
}

export function employeeFullName(e: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${e.firstName} ${e.lastName}`
}
