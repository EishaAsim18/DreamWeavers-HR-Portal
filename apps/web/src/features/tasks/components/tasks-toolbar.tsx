import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart2,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/constants'
import type { CalendarTask, TaskStatus } from '@/features/calendar/types/calendar.types'
import { STATUS_CONFIG } from '@/features/calendar/types/calendar.types'

export type TasksView = 'board' | 'list' | 'timeline'
export type QuickStatusFilter = 'all' | TaskStatus

const VIEW_OPTIONS: { id: TasksView; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'board', label: 'Board', icon: LayoutGrid },
  { id: 'list', label: 'List', icon: List },
  { id: 'timeline', label: 'Timeline', icon: BarChart2 },
]

const QUICK_STATUSES: QuickStatusFilter[] = [
  'all',
  'todo',
  'in_progress',
  'ready_for_review',
  'overdue',
  'completed',
]

interface TasksToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  activeView: TasksView
  onViewChange: (v: TasksView) => void
  statusFilter: QuickStatusFilter
  onStatusFilterChange: (v: QuickStatusFilter) => void
  allTasks: CalendarTask[]
  canCreateTask: boolean
  onNewTask: () => void
}

export function TasksToolbar({
  search,
  onSearchChange,
  activeView,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  allTasks,
  canCreateTask,
  onNewTask,
}: TasksToolbarProps) {
  const countByStatus = useMemo(() => {
    const map: Record<string, number> = { all: allTasks.length }
    allTasks.forEach((t) => {
      map[t.status] = (map[t.status] ?? 0) + 1
    })
    return map
  }, [allTasks])

  return (
    <div className="flex flex-col gap-2.5">
      {/* Top bar: search, view switch, actions */}
      <motion.div
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-4 py-2.5 shadow-[var(--dw-shadow-sm)]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Search */}
        <div className="relative flex min-w-[160px] flex-1 items-center sm:max-w-[280px]">
          <Search className="pointer-events-none absolute left-2.5 size-3.5 text-[var(--dw-color-ink-tertiary)]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] py-1.5 pl-8 pr-7 text-xs text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[var(--dw-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/10"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 flex size-4 items-center justify-center rounded-full text-[var(--dw-color-ink-tertiary)] hover:text-red-500"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="hidden md:block md:flex-1" />

        {/* View switcher */}
        <div className="relative flex items-center rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] p-0.5">
          {VIEW_OPTIONS.map((v) => {
            const Icon = v.icon
            const isActive = activeView === v.id
            return (
              <button
                key={v.id}
                onClick={() => onViewChange(v.id)}
                className="relative z-10 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors duration-150"
                style={{
                  color: isActive ? 'var(--dw-color-brand-primary)' : 'var(--dw-color-ink-tertiary)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="tasks-view-active-pill"
                    className="absolute inset-0 rounded-lg bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xs)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 size-3.5" />
                <span className="relative z-10 hidden sm:block">{v.label}</span>
              </button>
            )
          })}
        </div>

        {/* Link to Calendar — keeps the two modules aligned */}
        <Link
          to={ROUTES.calendar}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--dw-color-border-default)] px-3 py-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] transition-all hover:border-[var(--dw-color-brand-primary)]/40 hover:text-[var(--dw-color-brand-primary)]"
        >
          <CalendarIcon className="size-3.5" />
          <span className="hidden sm:block">Calendar</span>
        </Link>

        {/* New task */}
        {canCreateTask && (
          <motion.button
            onClick={onNewTask}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--dw-color-brand-primary)] to-[#3d6779] px-3 py-1.5 text-xs font-bold text-white shadow-[var(--dw-shadow-brand)]"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="size-3.5" />
            <span>New Task</span>
          </motion.button>
        )}
      </motion.div>

      {/* Quick status filters */}
      <motion.div
        className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        {QUICK_STATUSES.map((status) => {
          const isActive = statusFilter === status
          const label = status === 'all' ? 'All Tasks' : STATUS_CONFIG[status].label
          const icon = status === 'all' ? '📋' : STATUS_CONFIG[status].icon
          const count = countByStatus[status] ?? 0
          const activeColor = status === 'all' ? 'var(--dw-color-brand-primary)' : undefined

          return (
            <motion.button
              key={status}
              onClick={() => onStatusFilterChange(status)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                isActive
                  ? status === 'all'
                    ? 'border-[var(--dw-color-brand-primary)]/30 bg-[var(--dw-color-brand-primary-muted)]'
                    : `${STATUS_CONFIG[status].bg} border-transparent`
                  : 'border-transparent bg-[var(--dw-color-surface-base)] text-[var(--dw-color-ink-tertiary)] hover:border-[var(--dw-color-border-default)] hover:text-[var(--dw-color-ink-secondary)]',
              )}
              style={isActive ? { color: activeColor ?? undefined } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={isActive && status !== 'all' ? STATUS_CONFIG[status].color : ''}>{icon}</span>
              <span className={isActive && status !== 'all' ? STATUS_CONFIG[status].color : undefined}>{label}</span>
              {count > 0 && (
                <span
                  className="flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-black"
                  style={{
                    background: isActive ? 'rgba(0,0,0,0.08)' : 'var(--dw-color-surface-sunken)',
                    color: 'inherit',
                  }}
                >
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
