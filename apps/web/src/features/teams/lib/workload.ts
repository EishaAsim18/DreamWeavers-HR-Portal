import { STORAGE_KEYS } from '@/shared/constants'
import { MOCK_CALENDAR_TASKS } from '@/features/calendar/data/calendar.mock'
import type { CalendarTask } from '@/features/calendar/types/calendar.types'

const DONE_STATUSES = new Set(['completed', 'cancelled'])

/**
 * Reads the full (unfiltered) calendar task list straight from localStorage so
 * team rosters can show a workload indicator per member without needing an
 * authenticated fetch for every employee. Falls back to the static seed.
 */
function loadAllTasks(): CalendarTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.calendarTasks)
    if (raw) return JSON.parse(raw) as CalendarTask[]
  } catch {
    // ignore corrupt data
  }
  return MOCK_CALENDAR_TASKS
}

export interface EmployeeWorkload {
  active: number
  completed: number
  total: number
}

/** Aggregate workload (tasks/projects assigned) per employee id. */
export function getWorkloadByEmployee(): Record<string, EmployeeWorkload> {
  const tasks = loadAllTasks()
  const map: Record<string, EmployeeWorkload> = {}

  for (const task of tasks) {
    const bucket = map[task.assignedToId] ?? { active: 0, completed: 0, total: 0 }
    bucket.total += 1
    if (task.status === 'completed') bucket.completed += 1
    else if (!DONE_STATUSES.has(task.status)) bucket.active += 1
    map[task.assignedToId] = bucket
  }

  return map
}
