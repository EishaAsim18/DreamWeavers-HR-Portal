import type { User, Department } from '@dreamweavers/database'
import { getPermissions } from './permissions.js'

export interface ApiUser {
  id: string
  organizationId: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: User['role']
  permissions: ReturnType<typeof getPermissions>
  department?: string
  jobTitle?: string
}

type UserWithDept = User & { department?: Department | null }

export function serializeUser(user: UserWithDept): ApiUser {
  return {
    id: user.id,
    organizationId: user.organizationId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl ?? undefined,
    role: user.role,
    permissions: getPermissions(user.role),
    department: user.department?.name,
    jobTitle: user.jobTitle ?? undefined,
  }
}

export function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function startOfDay(date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function parseTimeOnDate(time: string, date: Date): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const d = new Date(date)
  d.setHours(hours, minutes, 0, 0)
  return d
}
