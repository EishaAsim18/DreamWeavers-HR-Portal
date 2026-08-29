import { useAuth } from '@/shared/hooks/use-auth'
import type { CalendarTask } from '../types/calendar.types'
import { getPerson } from '../data/calendar.mock'

/**
 * RBAC permission hook for the calendar module.
 * Encapsulates all role-based logic per the specification.
 */
export function useCalendarPermissions() {
  const { user } = useAuth()
  const role = user?.role

  // ── Visibility ─────────────────────────────────────────────────────────────
  // A task is only ever shown to the person it is assigned to — this holds
  // for every role, including admin and super_admin. Nobody browses a
  // "team-wide" task list here; each person's Tasks/Calendar view is theirs.

  /** Can this user see all employees' calendars? (No one can — each person sees only their own.) */
  const canViewAllCalendars = false

  /** Can this user see a specific employee's calendar? */
  const canViewUserCalendar = (targetUserId: string): boolean => {
    if (!user) return false
    return targetUserId === user.id
  }

  /** Can this user see a specific task? Only the assignee ever sees their own task. */
  const canViewTask = (task: CalendarTask): boolean => {
    if (!user) return false
    return task.assignedToId === user.id
  }

  // ── Task Creation ───────────────────────────────────────────────────────────

  /** Can this user create new tasks? */
  const canCreateTask = role === 'super_admin' || role === 'admin'

  /** Can this admin/super_admin assign to a specific target user? */
  const canAssignTo = (targetUserId: string): boolean => {
    if (!user) return false
    if (role === 'super_admin') return true // Can assign to anyone
    if (role === 'admin') {
      const target = getPerson(targetUserId)
      return target?.role === 'employee' // Admin can only assign to employees
    }
    return false
  }

  // ── Task Editing ────────────────────────────────────────────────────────────

  /** Can this user edit a task's details? */
  const canEditTask = (task: CalendarTask): boolean => {
    if (!user) return false
    if (role === 'super_admin') return true
    if (role === 'admin') {
      // Admin cannot edit super_admin's tasks
      const assigner = getPerson(task.assignedById)
      return assigner?.role !== 'super_admin' || task.assignedById === user.id
    }
    return false // Employees cannot edit task details
  }

  /** Can this user change the due date of a task? */
  const canChangeDueDate = (task: CalendarTask): boolean => {
    if (!user) return false
    if (role === 'super_admin') return true
    if (role === 'admin') {
      // Admin can reschedule employee tasks only
      const assignee = getPerson(task.assignedToId)
      return assignee?.role === 'employee'
    }
    return false // Employees cannot change due dates
  }

  // ── Task Deletion ───────────────────────────────────────────────────────────

  /** Can this user delete a task? */
  const canDeleteTask = (task: CalendarTask): boolean => {
    if (!user) return false
    if (role === 'super_admin') return true
    if (role === 'admin') {
      const assigner = getPerson(task.assignedById)
      return assigner?.role !== 'super_admin'
    }
    return false
  }

  // ── Drag & Drop ────────────────────────────────────────────────────────────

  /** Can this user drag and drop a task to change its due date? */
  const canDragTask = (task: CalendarTask): boolean => {
    if (!user) return false
    if (role === 'super_admin') return true
    if (role === 'admin') {
      const assignee = getPerson(task.assignedToId)
      return assignee?.role === 'employee'
    }
    return false
  }

  // ── Approval Workflow ──────────────────────────────────────────────────────

  /**
   * Can this user approve a task that is "ready_for_review"?
   *
   * Rules:
   * - Employee tasks → Admin OR Super Admin can approve
   * - Admin tasks → ONLY Super Admin can approve
   * - Admin CANNOT approve own task or another admin's task
   */
  const canApproveTask = (task: CalendarTask): boolean => {
    if (!user) return false
    if (task.status !== 'ready_for_review') return false

    const assignee = getPerson(task.assignedToId)
    if (!assignee) return false

    if (role === 'super_admin') return true // Super admin can approve any

    if (role === 'admin') {
      // Admin can only approve employee tasks, not other admins' tasks
      return assignee.role === 'employee'
    }

    return false
  }

  /** Can this user return a task for revision? */
  const canReturnForRevision = (task: CalendarTask): boolean => {
    return canApproveTask(task) // Same rules as approval
  }

  // ── Status Updates ─────────────────────────────────────────────────────────

  /** Can the current user mark this task as "ready for review"? */
  const canMarkReadyForReview = (task: CalendarTask): boolean => {
    if (!user) return false
    if (task.assignedToId !== user.id) return false
    return task.status === 'in_progress' || task.status === 'needs_revision'
  }

  /** Can this user update the completion percentage? */
  const canUpdateProgress = (task: CalendarTask): boolean => {
    if (!user) return false
    return task.assignedToId === user.id
  }

  /** Can this user upload an attachment? */
  const canUploadAttachment = (task: CalendarTask): boolean => {
    if (!user) return false
    return task.assignedToId === user.id || role === 'super_admin' || role === 'admin'
  }

  /** Can this user add a comment? */
  const canAddComment = (): boolean => !!user

  // ── Meeting ────────────────────────────────────────────────────────────────

  const canScheduleMeeting = role === 'super_admin' || role === 'admin'

  return {
    role,
    userId: user?.id,
    canViewAllCalendars,
    canViewUserCalendar,
    canViewTask,
    canCreateTask,
    canAssignTo,
    canEditTask,
    canChangeDueDate,
    canDeleteTask,
    canDragTask,
    canApproveTask,
    canReturnForRevision,
    canMarkReadyForReview,
    canUpdateProgress,
    canUploadAttachment,
    canAddComment,
    canScheduleMeeting,
  }
}
