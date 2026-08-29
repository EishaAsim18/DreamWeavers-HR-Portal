import { useState, useCallback, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import type {
  CalendarEvent,
  CalendarTask,
  CalendarMeeting,
  CalendarHoliday,
  CalendarView,
  CalendarFilters,
  TaskFormData,
  TaskStatus,
} from '../types/calendar.types'
import { MOCK_CALENDAR_MEETINGS, MOCK_CALENDAR_HOLIDAYS } from '../data/calendar.mock'
import { useCalendarPermissions } from './use-calendar-permissions'
import { useCalendarApi } from '../api/calendar.api'

const DEFAULT_FILTERS: CalendarFilters = {
  assigneeIds: [],
  priorities: [],
  statuses: [],
  showMeetings: true,
  showHolidays: true,
}

export function useCalendarStore() {
  const perms = useCalendarPermissions()
  const api = useCalendarApi()

  // ── Server state ─────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const [meetings, setMeetings] = useState<CalendarMeeting[]>(MOCK_CALENDAR_MEETINGS)
  const [holidays, setHolidays] = useState<CalendarHoliday[]>(MOCK_CALENDAR_HOLIDAYS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState<CalendarView>('dayGridMonth')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<CalendarTask | null>(null)
  const [defaultFormDate, setDefaultFormDate] = useState<string>('')
  const [filters, setFilters] = useState<CalendarFilters>(DEFAULT_FILTERS)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [loadingTaskIds, setLoadingTaskIds] = useState<Set<string>>(new Set())

  // ── Initial data load ─────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const [fetchedTasks, fetchedMeetings, fetchedHolidays] = await Promise.all([
          api.fetchTasks(),
          api.fetchMeetings(),
          api.fetchHolidays(),
        ])
        if (!mounted) return
        setTasks(fetchedTasks)
        setMeetings(fetchedMeetings)
        setHolidays(fetchedHolidays)
      } catch (e) {
        if (!mounted) return
        const msg = e instanceof Error ? e.message : 'Failed to load calendar data'
        setError(msg)
        toast.error(msg)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    void load()
    return () => { mounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perms.userId])

  // ── Derived: visible events (role-filtered) ───────────────────────────────
  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => perms.canViewTask(t))
  }, [tasks, perms])

  const visibleMeetings = useMemo(() => {
    if (!filters.showMeetings) return []
    return meetings
  }, [meetings, filters.showMeetings])

  const visibleHolidays = useMemo(() => {
    return filters.showHolidays ? holidays : []
  }, [holidays, filters.showHolidays])

  const filteredTasks = useMemo(() => {
    return visibleTasks.filter((t) => {
      if (filters.assigneeIds.length > 0 && !filters.assigneeIds.includes(t.assignedToId))
        return false
      if (filters.priorities.length > 0 && !filters.priorities.includes(t.priority))
        return false
      if (filters.statuses.length > 0 && !filters.statuses.includes(t.status))
        return false
      return true
    })
  }, [visibleTasks, filters])

  const allVisibleEvents = useMemo(
    () => [...filteredTasks, ...visibleMeetings, ...visibleHolidays],
    [filteredTasks, visibleMeetings, visibleHolidays],
  )

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setTaskLoading = (id: string, loading: boolean) => {
    setLoadingTaskIds((prev) => {
      const next = new Set(prev)
      if (loading) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const refreshTask = (updated: CalendarTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setSelectedEvent((prev) => {
      if (!prev || prev.calendarType !== 'task' || prev.id !== updated.id) return prev
      return updated
    })
  }

  // ── Drawer / Form ─────────────────────────────────────────────────────────
  const openTask = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedEvent(null), 300)
  }, [])

  const openCreateForm = useCallback((date?: string) => {
    if (!perms.canCreateTask) {
      toast.error("You don't have permission to create tasks.")
      return
    }
    setEditingTask(null)
    setDefaultFormDate(date ?? new Date().toISOString().split('T')[0])
    setIsFormOpen(true)
  }, [perms.canCreateTask])

  const openEditForm = useCallback((task: CalendarTask) => {
    if (!perms.canEditTask(task)) {
      toast.error("You don't have permission to edit this task.")
      return
    }
    setEditingTask(task)
    setIsFormOpen(true)
  }, [perms])

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setTimeout(() => setEditingTask(null), 300)
  }, [])

  // ── CRUD with API ─────────────────────────────────────────────────────────
  const createTask = useCallback(async (data: TaskFormData) => {
    try {
      const newTask = await api.createTask(data)
      setTasks((prev) => [...prev, newTask])
      toast.success('✅ Task created successfully')
      closeForm()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create task')
    }
  }, [api, closeForm])

  const updateTask = useCallback(async (taskId: string, updates: Partial<CalendarTask>) => {
    setTaskLoading(taskId, true)
    try {
      const updated = await api.updateTask(taskId, updates)
      refreshTask(updated)
      toast.success('Task updated')
      closeForm()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update task')
    } finally {
      setTaskLoading(taskId, false)
    }
  }, [api, closeForm]) // eslint-disable-line react-hooks/exhaustive-deps

  const deleteTask = useCallback(async (taskId: string) => {
    setTaskLoading(taskId, true)
    try {
      await api.deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      closeDrawer()
      toast.success('Task deleted')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete task')
    } finally {
      setTaskLoading(taskId, false)
    }
  }, [api, closeDrawer])

  const changeTaskStatus = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    setTaskLoading(taskId, true)
    try {
      const updated = await api.changeStatus(taskId, newStatus)
      refreshTask(updated)

      const msgs: Partial<Record<TaskStatus, string>> = {
        ready_for_review: '📤 Submitted for review',
        completed: '🎉 Task approved and completed!',
        needs_revision: '↺ Task returned for revision',
        in_progress: '▶ Task started',
        cancelled: 'Task cancelled',
      }
      toast.success(msgs[newStatus] ?? 'Status updated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update status')
    } finally {
      setTaskLoading(taskId, false)
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  const dragDropTask = useCallback(async (taskId: string, newDueDate: string): Promise<boolean> => {
    try {
      const updated = await api.reschedule(taskId, newDueDate)
      refreshTask(updated)
      toast.success(
        `📅 Due date moved to ${new Date(newDueDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}`,
      )
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Cannot reschedule this task')
      return false
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  const addComment = useCallback(async (taskId: string, content: string) => {
    try {
      await api.addComment(taskId, content)
      // Re-fetch the specific task to get updated comments
      const allTasks = await api.fetchTasks()
      const updated = allTasks.find((t) => t.id === taskId)
      if (updated) refreshTask(updated)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add comment')
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateProgress = useCallback(async (taskId: string, percent: number) => {
    try {
      const updated = await api.updateProgress(taskId, percent)
      refreshTask(updated)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update progress')
    }
  }, [api]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filters ───────────────────────────────────────────────────────────────
  const updateFilters = useCallback((updates: Partial<CalendarFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.assigneeIds.length) count++
    if (filters.priorities.length) count++
    if (filters.statuses.length) count++
    if (!filters.showMeetings) count++
    if (!filters.showHolidays) count++
    return count
  }, [filters])

  return {
    // Server state
    tasks,
    meetings,
    holidays,
    isLoading,
    error,
    loadingTaskIds,
    // UI state
    activeView,
    setActiveView,
    selectedEvent,
    isDrawerOpen,
    isFormOpen,
    editingTask,
    defaultFormDate,
    filters,
    isFiltersOpen,
    setIsFiltersOpen,
    // Computed
    allVisibleEvents,
    filteredTasks,
    activeFilterCount,
    // Handlers
    openTask,
    closeDrawer,
    openCreateForm,
    openEditForm,
    closeForm,
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    dragDropTask,
    addComment,
    updateProgress,
    updateFilters,
    resetFilters,
    // Permissions
    perms,
  }
}
