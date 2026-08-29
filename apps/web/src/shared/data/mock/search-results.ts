import type { SearchResult } from '@/shared/types'
import { ROUTES } from '@/shared/constants'

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: 'sr_1',
    type: 'person',
    title: 'Omar Farooq',
    subtitle: 'HR Director · Human Resources',
    href: ROUTES.employeeDetail('usr_admin_1'),
    meta: 'Employee',
  },
  {
    id: 'sr_2',
    type: 'task',
    title: 'Review Q3 onboarding documentation',
    subtitle: 'Due Jul 10 · High priority',
    href: ROUTES.taskDetail('task_cal_1'),
    meta: 'Task',
  },
  {
    id: 'sr_3',
    type: 'document',
    title: 'Employee Handbook v3.2',
    subtitle: 'HR · PDF · 2.4 MB',
    href: ROUTES.documents,
    meta: 'Document',
  },
  {
    id: 'sr_4',
    type: 'page',
    title: 'Attendance',
    subtitle: 'Track and manage attendance',
    href: ROUTES.attendance,
    meta: 'Page',
  },
]
