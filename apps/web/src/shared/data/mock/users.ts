import type { User } from '@/shared/types'
import { ROLE_PERMISSIONS } from '@/shared/constants'

/**
 * Seeded mock users — one per role with Pakistani names.
 *
 * SUPER_ADMIN is only ever created here (DB seed equivalent).
 * There is no API endpoint or UI that can create a super_admin at runtime.
 */
export const MOCK_USERS: User[] = [
  {
    id: 'usr_super_1',
    email: 'dweavers788@gmail.com',
    firstName: 'Ayesha',
    lastName: 'Siddiqui',
    role: 'super_admin',
    permissions: ROLE_PERMISSIONS.super_admin,
    department: 'Executive',
    jobTitle: 'Chief Technology Officer',
  },
  {
    id: 'usr_admin_1',
    email: 'admin@dreamweavers.com',
    firstName: 'Omar',
    lastName: 'Farooq',
    role: 'admin',
    permissions: ROLE_PERMISSIONS.admin,
    department: 'Human Resources',
    jobTitle: 'HR Director',
  },
  {
    id: 'usr_emp_1',
    email: 'employee@dreamweavers.com',
    firstName: 'Zara',
    lastName: 'Malik',
    role: 'employee',
    permissions: ROLE_PERMISSIONS.employee,
    department: 'Engineering',
    jobTitle: 'Software Engineer',
  },
]

/** Used as the default dev login (super_admin). */
export const DEFAULT_MOCK_USER = MOCK_USERS[0]
