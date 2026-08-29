/**
 * Calendar Mock Backend
 *
 * Simulates a real REST API for the calendar module.
 * – Full CRUD for tasks with RBAC enforcement
 * – localStorage persistence so data survives page refreshes
 * – Realistic network delays via sleep()
 * – In-process notification bus (toast + notification feed)
 */

import { STORAGE_KEYS } from '@/shared/constants'
import { sleep } from '@/shared/lib/utils'
import { AuthorizationError } from '@/shared/types'
import type { User } from '@/shared/types'
import {
  MOCK_CALENDAR_TASKS,
  MOCK_CALENDAR_MEETINGS,
  MOCK_CALENDAR_HOLIDAYS,
  getPerson,
} from '@/features/calendar/data/calendar.mock'
import type {
  CalendarTask,
  CalendarMeeting,
  CalendarHoliday,
  TaskStatus,
  TaskFormData,
  ActivityItem,
  CalendarComment,
} from '@/features/calendar/types/calendar.types'
import { requireAuth } from './authorization'

// ── Notifications bus ─────────────────────────────────────────────────────────
// We push notifications into the shared mock store so the bell icon reflects them.

import { MOCK_NOTIFICATIONS } from '@/shared/data/mock'
import type { Notification } from '@/shared/types'

let _notifId = 100
function pushNotification(notif: Omit<Notification, 'id' | 'read' | 'createdAt'>): void {
  const n: Notification = {
    ...notif,
    id: `notif_cal_${++_notifId}`,
    read: false,
    createdAt: new Date().toISOString(),
  }
  // Mutate the shared array so the notification bell picks it up
  ;(MOCK_NOTIFICATIONS as Notification[]).unshift(n)
}

// ── Persistence helpers ───────────────────────────────────────────────────────

function loadTasks(): CalendarTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.calendarTasks)
    if (raw) return JSON.parse(raw) as CalendarTask[]
  } catch {
    // ignore corrupt data
  }
  return [...MOCK_CALENDAR_TASKS]
}

function saveTasks(tasks: CalendarTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.calendarTasks, JSON.stringify(tasks))
  } catch {
    // ignore quota errors
  }
}

// In-memory mirror of persisted tasks
let _tasks: CalendarTask[] = loadTasks()

// ── RBAC helpers ──────────────────────────────────────────────────────────────

// A task is only ever returned to the person it is assigned to — this holds
// for every role. Each person's task list/calendar shows only their own work.
function canViewTask(user: User, task: CalendarTask): boolean {
  return task.assignedToId === user.id
}

function canEditTask(user: User, task: CalendarTask): boolean {
  if (user.role === 'super_admin') return true
  if (user.role === 'admin') {
    const assigner = getPerson(task.assignedById)
    return assigner?.role !== 'super_admin' || task.assignedById === user.id
  }
  return false
}

function canDeleteTask(user: User, task: CalendarTask): boolean {
  if (user.role === 'super_admin') return true
  if (user.role === 'admin') {
    const assigner = getPerson(task.assignedById)
    return assigner?.role !== 'super_admin'
  }
  return false
}

function canApproveTask(user: User, task: CalendarTask): boolean {
  if (task.status !== 'ready_for_review') return false
  const assignee = getPerson(task.assignedToId)
  if (!assignee) return false
  if (user.role === 'super_admin') return true
  if (user.role === 'admin') {
    return assignee.role === 'employee'
  }
  return false
}

function makeActivityItem(
  userId: string,
  userName: string,
  action: string,
  type: ActivityItem['type'],
  detail?: string,
): ActivityItem {
  return {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    userId,
    userName,
    action,
    detail,
    timestamp: new Date().toISOString(),
    type,
  }
}

// ── API handlers ──────────────────────────────────────────────────────────────

/** Fetch all tasks visible to the authenticated user. */
export async function mockFetchTasks(user: User): Promise<CalendarTask[]> {
  await sleep(350)
  requireAuth(user)
  _tasks = loadTasks() // Re-hydrate in case other tabs wrote
  return _tasks.filter((t) => canViewTask(user, t))
}

/** Fetch meetings visible to the authenticated user. */
export async function mockFetchMeetings(user: User): Promise<CalendarMeeting[]> {
  await sleep(200)
  requireAuth(user)
  if (user.role === 'super_admin') return [...MOCK_CALENDAR_MEETINGS]
  if (user.role === 'admin') return [...MOCK_CALENDAR_MEETINGS]
  return MOCK_CALENDAR_MEETINGS.filter((m) => m.attendeeIds.includes(user.id))
}

/** Fetch holidays (all roles). */
export async function mockFetchHolidays(_user: User): Promise<CalendarHoliday[]> {
  await sleep(150)
  return [...MOCK_CALENDAR_HOLIDAYS]
}

/** Create a new task. Only admin+ roles can create tasks. */
export async function mockCreateTask(user: User, data: TaskFormData): Promise<CalendarTask> {
  await sleep(500)
  requireAuth(user)

  if (user.role === 'employee') {
    throw new AuthorizationError('Employees cannot create tasks.')
  }

  if (user.role === 'admin') {
    const target = getPerson(data.assignedToId)
    if (target && target.role !== 'employee') {
      throw new AuthorizationError('Admins can only assign tasks to employees.')
    }
  }

  const actor = getPerson(user.id)
  const assignee = getPerson(data.assignedToId)
  const actorName = actor?.name ?? user.id

  const newTask: CalendarTask = {
    id: `task_cal_${Date.now()}`,
    calendarType: 'task',
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    labels: data.labels,
    attachments: [],
    comments: [],
    assignedById: user.id,
    assignedToId: data.assignedToId,
    reviewerId: data.reviewerId || undefined,
    createdAt: new Date().toISOString(),
    startDate: data.startDate,
    dueDate: data.dueDate,
    estimatedHours: data.estimatedHours,
    completionPercent: 0,
    activityTimeline: [
      makeActivityItem(user.id, actorName, 'Created task', 'create'),
      makeActivityItem(user.id, actorName, 'Assigned to', 'assign', assignee?.name ?? data.assignedToId),
    ],
  }

  _tasks = [..._tasks, newTask]
  saveTasks(_tasks)

  // Notification: task assigned
  if (assignee) {
    pushNotification({
      category: 'task',
      title: `New task assigned: ${newTask.title}`,
      description: `Assigned by ${actorName} · Due ${new Date(data.dueDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}`,
      href: '/calendar',
    })
  }

  return newTask
}

/** Update task fields. Respects RBAC per role. */
export async function mockUpdateTask(
  user: User,
  taskId: string,
  updates: Partial<CalendarTask>,
): Promise<CalendarTask> {
  await sleep(400)
  requireAuth(user)

  const task = _tasks.find((t) => t.id === taskId)
  if (!task) throw new Error('Task not found')

  if (!canEditTask(user, task)) {
    throw new AuthorizationError('You do not have permission to edit this task.')
  }

  const actor = getPerson(user.id)
  const actorName = actor?.name ?? user.id

  const updatedTask: CalendarTask = {
    ...task,
    ...updates,
    id: taskId,
    activityTimeline: [
      ...task.activityTimeline,
      makeActivityItem(user.id, actorName, 'Updated task', 'status'),
    ],
  }

  _tasks = _tasks.map((t) => (t.id === taskId ? updatedTask : t))
  saveTasks(_tasks)
  return updatedTask
}

/** Change task status — handles the full approval workflow. */
export async function mockChangeTaskStatus(
  user: User,
  taskId: string,
  newStatus: TaskStatus,
): Promise<CalendarTask> {
  await sleep(300)
  requireAuth(user)

  const task = _tasks.find((t) => t.id === taskId)
  if (!task) throw new Error('Task not found')

  const actor = getPerson(user.id)
  const actorName = actor?.name ?? user.id
  const assignee = getPerson(task.assignedToId)
  const assigner = getPerson(task.assignedById)

  // RBAC: approval workflow
  if (newStatus === 'completed') {
    if (!canApproveTask(user, task)) {
      throw new AuthorizationError('You do not have permission to approve this task.')
    }
  }

  if (newStatus === 'needs_revision') {
    if (!canApproveTask(user, task)) {
      throw new AuthorizationError('You do not have permission to return this task for revision.')
    }
  }

  if (newStatus === 'ready_for_review') {
    if (task.assignedToId !== user.id) {
      throw new AuthorizationError('Only the assignee can submit a task for review.')
    }
  }

  // Update completion % on completion
  const completionPercent = newStatus === 'completed' ? 100 : task.completionPercent
  const activityType: ActivityItem['type'] =
    newStatus === 'completed' ? 'complete' :
    newStatus === 'needs_revision' ? 'revision' :
    newStatus === 'ready_for_review' ? 'status' : 'status'

  const actionLabel: Record<TaskStatus, string> = {
    todo: 'Reset to To Do',
    in_progress: 'Started task',
    ready_for_review: 'Submitted for review',
    needs_revision: 'Returned for revision',
    completed: 'Approved and completed',
    cancelled: 'Cancelled task',
    overdue: 'Marked as overdue',
  }

  const updatedTask: CalendarTask = {
    ...task,
    status: newStatus,
    completionPercent,
    activityTimeline: [
      ...task.activityTimeline,
      makeActivityItem(user.id, actorName, actionLabel[newStatus], activityType, undefined),
    ],
  }

  _tasks = _tasks.map((t) => (t.id === taskId ? updatedTask : t))
  saveTasks(_tasks)

  // Emit notifications
  if (newStatus === 'ready_for_review') {
    const reviewer = task.reviewerId ? getPerson(task.reviewerId) : assigner
    pushNotification({
      category: 'approval',
      title: `Review requested: ${task.title}`,
      description: `${assignee?.name ?? 'Someone'} has submitted this task for review`,
      href: '/calendar',
      actions: [
        { id: 'approve', label: 'Approve', variant: 'primary' },
        { id: 'view', label: 'View', variant: 'ghost' },
      ],
    })
    void reviewer
  }

  if (newStatus === 'completed') {
    pushNotification({
      category: 'task',
      title: `✅ Task approved: ${task.title}`,
      description: `Approved by ${actorName}`,
      href: '/calendar',
    })
  }

  if (newStatus === 'needs_revision') {
    pushNotification({
      category: 'task',
      title: `↺ Revision needed: ${task.title}`,
      description: `${actorName} returned this task for revision`,
      href: '/calendar',
    })
  }

  return updatedTask
}

/** Delete a task. Respects RBAC. */
export async function mockDeleteTask(user: User, taskId: string): Promise<void> {
  await sleep(300)
  requireAuth(user)

  const task = _tasks.find((t) => t.id === taskId)
  if (!task) throw new Error('Task not found')

  if (!canDeleteTask(user, task)) {
    throw new AuthorizationError('You do not have permission to delete this task.')
  }

  _tasks = _tasks.filter((t) => t.id !== taskId)
  saveTasks(_tasks)
}

/** Move a task to a new due date (drag & drop). */
export async function mockRescheduleTask(
  user: User,
  taskId: string,
  newDueDate: string,
): Promise<CalendarTask> {
  await sleep(200)
  requireAuth(user)

  const task = _tasks.find((t) => t.id === taskId)
  if (!task) throw new Error('Task not found')

  if (user.role === 'employee') {
    throw new AuthorizationError('Employees cannot change task due dates.')
  }

  if (user.role === 'admin') {
    const assignee = getPerson(task.assignedToId)
    if (assignee?.role !== 'employee') {
      throw new AuthorizationError('Admins can only reschedule employee tasks.')
    }
  }

  const actor = getPerson(user.id)
  const actorName = actor?.name ?? user.id

  const updatedTask: CalendarTask = {
    ...task,
    dueDate: newDueDate,
    activityTimeline: [
      ...task.activityTimeline,
      makeActivityItem(
        user.id,
        actorName,
        'Changed due date to',
        'status',
        new Date(newDueDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      ),
    ],
  }

  _tasks = _tasks.map((t) => (t.id === taskId ? updatedTask : t))
  saveTasks(_tasks)
  return updatedTask
}

/** Add a comment to a task. */
export async function mockAddComment(
  user: User,
  taskId: string,
  content: string,
): Promise<CalendarComment> {
  await sleep(250)
  requireAuth(user)

  const task = _tasks.find((t) => t.id === taskId)
  if (!task) throw new Error('Task not found')

  const person = getPerson(user.id)

  const comment: CalendarComment = {
    id: `cmt_${Date.now()}`,
    authorId: user.id,
    authorName: person?.name ?? 'Unknown',
    authorInitials: person?.initials ?? '??',
    authorColor: person?.avatarColor ?? '#6b7280',
    content,
    createdAt: new Date().toISOString(),
  }

  const actor = getPerson(user.id)
  const actorName = actor?.name ?? user.id

  const updatedTask: CalendarTask = {
    ...task,
    comments: [...task.comments, comment],
    activityTimeline: [
      ...task.activityTimeline,
      makeActivityItem(user.id, actorName, 'Added a comment', 'comment'),
    ],
  }

  _tasks = _tasks.map((t) => (t.id === taskId ? updatedTask : t))
  saveTasks(_tasks)
  return comment
}

/** Update completion percentage. */
export async function mockUpdateProgress(
  user: User,
  taskId: string,
  percent: number,
): Promise<CalendarTask> {
  await sleep(150)
  requireAuth(user)

  const task = _tasks.find((t) => t.id === taskId)
  if (!task) throw new Error('Task not found')

  if (task.assignedToId !== user.id && user.role !== 'super_admin') {
    throw new AuthorizationError('Only the assignee can update progress.')
  }

  const updatedTask: CalendarTask = { ...task, completionPercent: percent }
  _tasks = _tasks.map((t) => (t.id === taskId ? updatedTask : t))
  saveTasks(_tasks)
  return updatedTask
}

/** Reset all calendar data to initial mock data. */
export function mockResetCalendarData(): void {
  _tasks = [...MOCK_CALENDAR_TASKS]
  saveTasks(_tasks)
}
