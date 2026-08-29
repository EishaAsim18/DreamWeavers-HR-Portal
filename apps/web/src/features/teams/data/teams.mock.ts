import type { Team } from '../types/team.types'

/**
 * Seed teams. Member `employeeId`s are drawn from `CALENDAR_PEOPLE`
 * (`@/features/calendar/data/calendar.mock`) so that team rosters, task
 * assignment, and the employee directory all share one identity space.
 */
export const MOCK_TEAMS: Team[] = [
  {
    id: 'team_1',
    name: 'Engineering',
    description: 'Builds and ships the DreamWeavers platform — product, infra, and everything in between.',
    color: '#4a7c92',
    managerId: 'usr_super_1',
    members: [
      { employeeId: 'usr_super_1', role: 'Manager', joinedAt: '2024-01-10T08:00:00Z' },
      { employeeId: 'usr_emp_1', role: 'Software Engineer', joinedAt: '2024-02-01T08:00:00Z' },
      { employeeId: 'usr_emp_2', role: 'Frontend Developer', joinedAt: '2024-03-15T08:00:00Z' },
      { employeeId: 'usr_emp_4', role: 'DevOps Engineer', joinedAt: '2024-04-20T08:00:00Z' },
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'team_2',
    name: 'Product & Design',
    description: 'Owns the product roadmap and crafts the end-to-end user experience.',
    color: '#9333ea',
    managerId: 'usr_emp_5',
    members: [
      { employeeId: 'usr_emp_5', role: 'Manager', joinedAt: '2024-01-15T08:00:00Z' },
      { employeeId: 'usr_emp_3', role: 'UI/UX Designer', joinedAt: '2024-02-10T08:00:00Z' },
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'team_3',
    name: 'People & Operations',
    description: 'Keeps the company running — hiring, culture, facilities, and day-to-day operations.',
    color: '#059669',
    managerId: 'usr_admin_1',
    members: [
      { employeeId: 'usr_admin_1', role: 'Manager', joinedAt: '2024-01-05T08:00:00Z' },
      { employeeId: 'usr_admin_2', role: 'Operations Manager', joinedAt: '2024-01-20T08:00:00Z' },
    ],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },
]
