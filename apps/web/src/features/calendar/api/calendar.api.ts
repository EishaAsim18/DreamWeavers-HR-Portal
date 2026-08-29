/**
 * Calendar API client.
 *
 * A thin typed wrapper around the mock backend handlers.
 * When a real backend is ready, swap these implementations for real fetch() calls
 * — the rest of the application stays unchanged.
 */

import { useAuth } from '@/shared/hooks/use-auth'
import {
  mockFetchTasks,
  mockFetchMeetings,
  mockFetchHolidays,
  mockCreateTask,
  mockUpdateTask,
  mockDeleteTask,
  mockChangeTaskStatus,
  mockRescheduleTask,
  mockAddComment,
  mockUpdateProgress,
} from '@/shared/api/mock/calendar.mock'
import type {
  CalendarTask,
  TaskStatus,
  TaskFormData,
  CalendarComment,
} from '../types/calendar.types'
import type { User } from '@/shared/types'

// ── Raw API functions (pass user explicitly) ──────────────────────────────────

export const calendarApi = {
  fetchTasks: (user: User) => mockFetchTasks(user),
  fetchMeetings: (user: User) => mockFetchMeetings(user),
  fetchHolidays: (user: User) => mockFetchHolidays(user),
  createTask: (user: User, data: TaskFormData) => mockCreateTask(user, data),
  updateTask: (user: User, id: string, updates: Partial<CalendarTask>) =>
    mockUpdateTask(user, id, updates),
  deleteTask: (user: User, id: string) => mockDeleteTask(user, id),
  changeStatus: (user: User, id: string, status: TaskStatus) =>
    mockChangeTaskStatus(user, id, status),
  reschedule: (user: User, id: string, newDate: string) =>
    mockRescheduleTask(user, id, newDate),
  addComment: (user: User, taskId: string, content: string) =>
    mockAddComment(user, taskId, content),
  updateProgress: (user: User, taskId: string, percent: number) =>
    mockUpdateProgress(user, taskId, percent),
} as const

// ── Hook: bound to current session ───────────────────────────────────────────

/** Returns API methods pre-bound to the currently authenticated user. */
export function useCalendarApi() {
  const { user } = useAuth()

  if (!user) throw new Error('useCalendarApi must be used when authenticated')

  return {
    fetchTasks: () => calendarApi.fetchTasks(user),
    fetchMeetings: () => calendarApi.fetchMeetings(user),
    fetchHolidays: () => calendarApi.fetchHolidays(user),
    createTask: (data: TaskFormData) => calendarApi.createTask(user, data),
    updateTask: (id: string, updates: Partial<CalendarTask>) =>
      calendarApi.updateTask(user, id, updates),
    deleteTask: (id: string) => calendarApi.deleteTask(user, id),
    changeStatus: (id: string, status: TaskStatus) =>
      calendarApi.changeStatus(user, id, status),
    reschedule: (id: string, newDate: string) =>
      calendarApi.reschedule(user, id, newDate),
    addComment: (taskId: string, content: string): Promise<CalendarComment> =>
      calendarApi.addComment(user, taskId, content),
    updateProgress: (taskId: string, percent: number) =>
      calendarApi.updateProgress(user, taskId, percent),
  }
}
