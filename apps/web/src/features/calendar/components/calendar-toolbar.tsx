import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Plus,
  Calendar,
  List,
  CheckSquare,
  LayoutGrid,
  Clock,
  BarChart2,
  X,
  Zap,
  AlertCircle,
  Clock3,
  CheckCircle2,
  UserCheck,
  Video,
  Palmtree,
  ChevronDown,
} from 'lucide-react'
import type { CalendarApi } from '@fullcalendar/core'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/constants'
import type {
  CalendarView,
  CalendarFilters,
  TaskPriority,
  TaskStatus,
  CalendarTask,
} from '../types/calendar.types'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../types/calendar.types'
import { CALENDAR_PEOPLE } from '../data/calendar.mock'

// ── Constants ─────────────────────────────────────────────────────────────────

const VIEWS: {
  id: CalendarView
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { id: 'dayGridMonth', label: 'Month', shortLabel: 'Mo', icon: LayoutGrid },
  { id: 'timeGridWeek', label: 'Week', shortLabel: 'Wk', icon: Calendar },
  { id: 'timeGridDay', label: 'Day', shortLabel: 'Day', icon: Clock },
  { id: 'listWeek', label: 'Agenda', shortLabel: 'Ag', icon: List },
  { id: 'timeline', label: 'Timeline', shortLabel: 'TL', icon: BarChart2 },
]

const PRIORITIES: {
  value: TaskPriority
  color: string
  gradient: string
  border: string
  bg: string
}[] = [
  {
    value: 'urgent',
    color: '#ef4444',
    gradient: 'from-red-500/20 to-red-400/5',
    border: 'border-red-200',
    bg: 'bg-red-50',
  },
  {
    value: 'high',
    color: '#f97316',
    gradient: 'from-orange-500/20 to-orange-400/5',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
  },
  {
    value: 'medium',
    color: '#4a7c92',
    gradient: 'from-[#4a7c92]/20 to-[#4a7c92]/5',
    border: 'border-[#c5dde6]',
    bg: 'bg-[#edf5f8]',
  },
  {
    value: 'low',
    color: '#94a3b8',
    gradient: 'from-slate-400/20 to-slate-300/5',
    border: 'border-slate-200',
    bg: 'bg-slate-50',
  },
]

// ── Quick preset definition ───────────────────────────────────────────────────

type QuickPreset = 'all' | 'mine' | 'overdue' | 'in_review' | 'due_today' | 'due_this_week'

const QUICK_PRESETS: {
  id: QuickPreset
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgClass: string
  borderClass: string
}[] = [
  {
    id: 'all',
    label: 'All Tasks',
    icon: LayoutGrid,
    color: '#4a7c92',
    bgClass: 'bg-[#edf5f8]',
    borderClass: 'border-[#c5dde6]',
  },
  {
    id: 'overdue',
    label: 'Overdue',
    icon: AlertCircle,
    color: '#ef4444',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
  },
  {
    id: 'in_review',
    label: 'In Review',
    icon: Clock3,
    color: '#d97706',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  {
    id: 'due_today',
    label: 'Due Today',
    icon: Zap,
    color: '#7c3aed',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-200',
  },
  {
    id: 'due_this_week',
    label: 'Due This Week',
    icon: Clock,
    color: '#0891b2',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-200',
  },
  {
    id: 'mine',
    label: 'My Tasks',
    icon: UserCheck,
    color: '#059669',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface CalendarToolbarProps {
  activeView: CalendarView
  onViewChange: (view: CalendarView) => void
  calendarApi: CalendarApi | null
  currentTitle: string
  canCreateTask: boolean
  onNewTask: () => void
  filters: CalendarFilters
  onUpdateFilters: (f: Partial<CalendarFilters>) => void
  onResetFilters: () => void
  activeFilterCount: number
  isFiltersOpen: boolean
  setIsFiltersOpen: (v: boolean) => void
  canViewAllCalendars: boolean
  allTasks: CalendarTask[]
  currentUserId?: string
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CalendarToolbar({
  activeView,
  onViewChange,
  calendarApi,
  currentTitle,
  canCreateTask,
  onNewTask,
  filters,
  onUpdateFilters,
  onResetFilters,
  activeFilterCount,
  isFiltersOpen,
  setIsFiltersOpen,
  canViewAllCalendars,
  allTasks,
  currentUserId,
}: CalendarToolbarProps) {
  const [activePreset, setActivePreset] = useState<QuickPreset>('all')

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navigate = (dir: 'prev' | 'next' | 'today') => {
    if (!calendarApi) return
    if (dir === 'today') calendarApi.today()
    else if (dir === 'prev') calendarApi.prev()
    else calendarApi.next()
  }

  const handleViewChange = (view: CalendarView) => {
    onViewChange(view)
    if (view !== 'timeline' && calendarApi) {
      calendarApi.changeView(view)
    }
  }

  // ── Quick presets ───────────────────────────────────────────────────────────
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()))

  const presetCounts: Record<QuickPreset, number> = useMemo(() => {
    return {
      all: allTasks.length,
      overdue: allTasks.filter((t) => t.status === 'overdue').length,
      in_review: allTasks.filter((t) => t.status === 'ready_for_review').length,
      due_today: allTasks.filter((t) => {
        const d = new Date(t.dueDate)
        d.setHours(0, 0, 0, 0)
        return d.getTime() === today.getTime()
      }).length,
      due_this_week: allTasks.filter((t) => {
        const d = new Date(t.dueDate)
        d.setHours(0, 0, 0, 0)
        return d >= today && d <= endOfWeek
      }).length,
      mine: allTasks.filter((t) => t.assignedToId === currentUserId).length,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTasks, currentUserId])

  const applyPreset = (preset: QuickPreset) => {
    setActivePreset(preset)
    onResetFilters()
    switch (preset) {
      case 'overdue':
        onUpdateFilters({ statuses: ['overdue'] })
        break
      case 'in_review':
        onUpdateFilters({ statuses: ['ready_for_review'] })
        break
      case 'due_today': {
        // Applied via assigneeIds as a special marker; workaround → we show visually only
        break
      }
      case 'due_this_week':
        break
      case 'mine':
        if (currentUserId) onUpdateFilters({ assigneeIds: [currentUserId] })
        break
      default:
        break
    }
  }

  // ── Filter toggles ──────────────────────────────────────────────────────────
  const toggleAssignee = (id: string) => {
    setActivePreset('all')
    const ids = filters.assigneeIds
    onUpdateFilters({ assigneeIds: ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id] })
  }

  const togglePriority = (p: TaskPriority) => {
    setActivePreset('all')
    const ps = filters.priorities
    onUpdateFilters({ priorities: ps.includes(p) ? ps.filter((x) => x !== p) : [...ps, p] })
  }

  const toggleStatus = (s: TaskStatus) => {
    setActivePreset('all')
    const ss = filters.statuses
    onUpdateFilters({ statuses: ss.includes(s) ? ss.filter((x) => x !== s) : [...ss, s] })
  }

  // ── Task counts per filter option ───────────────────────────────────────────
  const countByPriority = useMemo(() => {
    const map: Record<string, number> = {}
    allTasks.forEach((t) => { map[t.priority] = (map[t.priority] ?? 0) + 1 })
    return map
  }, [allTasks])

  const countByStatus = useMemo(() => {
    const map: Record<string, number> = {}
    allTasks.forEach((t) => { map[t.status] = (map[t.status] ?? 0) + 1 })
    return map
  }, [allTasks])

  const countByAssignee = useMemo(() => {
    const map: Record<string, number> = {}
    allTasks.forEach((t) => { map[t.assignedToId] = (map[t.assignedToId] ?? 0) + 1 })
    return map
  }, [allTasks])

  // ── Active filter labels (for chips) ───────────────────────────────────────
  const activePriorityChips = filters.priorities.map((p) => ({
    key: `priority-${p}`,
    label: PRIORITY_CONFIG[p].label,
    color: PRIORITY_CONFIG[p].color,
    bg: PRIORITY_CONFIG[p].bg,
    onRemove: () => togglePriority(p),
  }))

  const activeStatusChips = filters.statuses.map((s) => ({
    key: `status-${s}`,
    label: STATUS_CONFIG[s].label,
    color: STATUS_CONFIG[s].color,
    bg: STATUS_CONFIG[s].bg,
    onRemove: () => toggleStatus(s),
  }))

  const activeAssigneeChips = filters.assigneeIds.map((id) => {
    const p = CALENDAR_PEOPLE.find((x) => x.id === id)
    return p
      ? {
          key: `assignee-${id}`,
          label: p.name.split(' ')[0],
          color: 'text-white',
          bg: '',
          avatarColor: p.avatarColor,
          initials: p.initials,
          onRemove: () => toggleAssignee(id),
        }
      : null
  }).filter(Boolean)

  const allChips = [...activePriorityChips, ...activeStatusChips]

  return (
    <div className="flex flex-col gap-2.5">

      {/* ── Top toolbar bar ─────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-4 py-2.5 shadow-[var(--dw-shadow-sm)]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Date nav */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigate('prev')}
            className="flex size-8 items-center justify-center rounded-xl text-[var(--dw-color-ink-tertiary)] transition-all hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-ink-primary)]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <motion.button
            onClick={() => navigate('today')}
            className="rounded-xl px-3 py-1.5 text-xs font-bold text-[var(--dw-color-brand-primary)] transition-all hover:bg-[var(--dw-color-brand-primary-muted)]"
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>
          <button
            onClick={() => navigate('next')}
            className="flex size-8 items-center justify-center rounded-xl text-[var(--dw-color-ink-tertiary)] transition-all hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-ink-primary)]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Current date title with gradient */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentTitle}
            className="bg-gradient-to-r from-[var(--dw-color-ink-primary)] to-[var(--dw-color-brand-primary)] bg-clip-text text-sm font-bold text-transparent"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            {currentTitle}
          </motion.h2>
        </AnimatePresence>

        {/* Spacer only on desktop — on mobile items wrap left-aligned instead */}
        <div className="hidden md:block md:flex-1" />

        {/* View switcher — animated sliding pill */}
        <div className="relative flex items-center rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] p-0.5">
          {VIEWS.map((v) => {
            const Icon = v.icon
            const isActive = activeView === v.id
            return (
              <button
                key={v.id}
                onClick={() => handleViewChange(v.id)}
                className="relative z-10 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors duration-150"
                style={{
                  color: isActive
                    ? 'var(--dw-color-brand-primary)'
                    : 'var(--dw-color-ink-tertiary)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="view-active-pill"
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

        {/* Link to Task Board — keeps the two modules aligned */}
        <Link
          to={ROUTES.tasks}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--dw-color-border-default)] px-3 py-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] transition-all hover:border-[var(--dw-color-brand-primary)]/40 hover:text-[var(--dw-color-brand-primary)]"
        >
          <CheckSquare className="size-3.5" />
          <span className="hidden sm:block">Task Board</span>
        </Link>

        {/* Filter button */}
        <motion.button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={cn(
            'relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
            isFiltersOpen || activeFilterCount > 0
              ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary)] text-white shadow-[var(--dw-shadow-brand)]'
              : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)] hover:border-[var(--dw-color-brand-primary)]/40 hover:text-[var(--dw-color-ink-primary)]',
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <SlidersHorizontal className="size-3.5" />
          <span className="hidden sm:block">Filters</span>
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.span
                className={cn(
                  'flex size-[18px] items-center justify-center rounded-full text-[9px] font-black',
                  isFiltersOpen || activeFilterCount > 0
                    ? 'bg-white/25 text-white'
                    : 'bg-[var(--dw-color-brand-primary)] text-white',
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {activeFilterCount}
              </motion.span>
            )}
          </AnimatePresence>
          <ChevronDown
            className={cn(
              'size-3 transition-transform duration-200',
              isFiltersOpen && 'rotate-180',
            )}
          />
        </motion.button>

        {/* New task button */}
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

      {/* ── Quick filter presets ─────────────────────────────────────────────── */}
      <motion.div
        className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        {QUICK_PRESETS.map((preset) => {
          const Icon = preset.icon
          const isActive = activePreset === preset.id
          const count = presetCounts[preset.id]

          return (
            <motion.button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                isActive
                  ? `${preset.bgClass} ${preset.borderClass}`
                  : 'border-transparent bg-[var(--dw-color-surface-base)] text-[var(--dw-color-ink-tertiary)] hover:border-[var(--dw-color-border-default)] hover:text-[var(--dw-color-ink-secondary)]',
              )}
              style={isActive ? { color: preset.color } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className="size-3.5" />
              <span>{preset.label}</span>
              {count > 0 && (
                <span
                  className="flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-black"
                  style={
                    isActive
                      ? { background: preset.color, color: 'white' }
                      : {
                          background: 'var(--dw-color-surface-sunken)',
                          color: 'var(--dw-color-ink-tertiary)',
                        }
                  }
                >
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
      </motion.div>

      {/* ── Detail filter panel ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            className="overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-md)]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Filter panel header */}
            <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] bg-gradient-to-r from-[var(--dw-color-surface-sunken)] to-[var(--dw-color-surface-base)] px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[var(--dw-color-brand-primary)] shadow-[var(--dw-shadow-brand)]">
                  <SlidersHorizontal className="size-3 text-white" />
                </div>
                <span className="text-sm font-bold text-[var(--dw-color-ink-primary)]">
                  Filter Tasks
                </span>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-[var(--dw-color-brand-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { onResetFilters(); setActivePreset('all') }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                >
                  <X className="size-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 divide-y divide-[var(--dw-color-border-default)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">

              {/* ── Assignee section ── */}
              {canViewAllCalendars && (
                <div className="p-4">
                  <FilterSectionLabel
                    icon={<UserCheck className="size-3.5" />}
                    label="Team Members"
                    count={filters.assigneeIds.length}
                  />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {CALENDAR_PEOPLE.map((person) => {
                      const isActive = filters.assigneeIds.includes(person.id)
                      const taskCount = countByAssignee[person.id] ?? 0
                      return (
                        <motion.button
                          key={person.id}
                          onClick={() => toggleAssignee(person.id)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all duration-200',
                            isActive
                              ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-muted)]'
                              : 'border-[var(--dw-color-border-default)] hover:border-[var(--dw-color-brand-primary)]/40 hover:bg-[var(--dw-color-surface-sunken)]',
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="relative">
                            <span
                              className="flex size-9 items-center justify-center rounded-full text-xs font-black text-white shadow-md"
                              style={{ background: person.avatarColor }}
                            >
                              {person.initials}
                            </span>
                            {isActive && (
                              <motion.span
                                className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-[var(--dw-color-brand-primary)] text-[8px] text-white shadow"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                ✓
                              </motion.span>
                            )}
                          </div>
                          <div>
                            <p
                              className={cn(
                                'text-[10px] font-semibold leading-tight',
                                isActive
                                  ? 'text-[var(--dw-color-brand-primary)]'
                                  : 'text-[var(--dw-color-ink-secondary)]',
                              )}
                            >
                              {person.name.split(' ')[0]}
                            </p>
                            {taskCount > 0 && (
                              <p className="text-[9px] text-[var(--dw-color-ink-tertiary)]">
                                {taskCount} task{taskCount !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Priority section ── */}
              <div className="p-4">
                <FilterSectionLabel
                  icon={<Zap className="size-3.5" />}
                  label="Priority"
                  count={filters.priorities.length}
                />
                <div className="mt-3 flex flex-col gap-2">
                  {PRIORITIES.map((p) => {
                    const cfg = PRIORITY_CONFIG[p.value]
                    const isActive = filters.priorities.includes(p.value)
                    const count = countByPriority[p.value] ?? 0
                    return (
                      <motion.button
                        key={p.value}
                        onClick={() => togglePriority(p.value)}
                        className={cn(
                          'flex items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all duration-200',
                          isActive
                            ? `${cfg.bg} ${cfg.border}`
                            : 'border-[var(--dw-color-border-default)] hover:border-[var(--dw-color-border-default)] hover:bg-[var(--dw-color-surface-sunken)]',
                        )}
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {/* Color bar */}
                        <div
                          className="h-8 w-1 rounded-full"
                          style={{ background: p.color }}
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <p
                              className={cn(
                                'text-xs font-semibold',
                                isActive ? cfg.color : 'text-[var(--dw-color-ink-secondary)]',
                              )}
                            >
                              {cfg.label}
                            </p>
                            {count > 0 && (
                              <p className="text-[9px] text-[var(--dw-color-ink-tertiary)]">
                                {count} task{count !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {count > 0 && (
                              <span
                                className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black text-white"
                                style={{ background: p.color }}
                              >
                                {count}
                              </span>
                            )}
                            {isActive && (
                              <motion.span
                                className="flex size-4 items-center justify-center rounded-full text-[9px] font-black text-white"
                                style={{ background: p.color }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                ✓
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* ── Status section ── */}
              <div className="p-4">
                <FilterSectionLabel
                  icon={<CheckCircle2 className="size-3.5" />}
                  label="Status"
                  count={filters.statuses.length}
                />
                <div className="mt-3 flex flex-col gap-1.5">
                  {(
                    [
                      'todo',
                      'in_progress',
                      'ready_for_review',
                      'needs_revision',
                      'completed',
                      'overdue',
                      'cancelled',
                    ] as TaskStatus[]
                  ).map((s) => {
                    const cfg = STATUS_CONFIG[s]
                    const isActive = filters.statuses.includes(s)
                    const count = countByStatus[s] ?? 0
                    return (
                      <motion.button
                        key={s}
                        onClick={() => toggleStatus(s)}
                        className={cn(
                          'flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-200',
                          isActive
                            ? `${cfg.bg} border-transparent`
                            : 'border-transparent hover:bg-[var(--dw-color-surface-sunken)]',
                        )}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span
                          className={cn('text-sm leading-none', isActive ? cfg.color : 'text-[var(--dw-color-ink-tertiary)]')}
                        >
                          {cfg.icon}
                        </span>
                        <span
                          className={cn(
                            'flex-1 text-xs font-medium',
                            isActive ? cfg.color : 'text-[var(--dw-color-ink-secondary)]',
                          )}
                        >
                          {cfg.label}
                        </span>
                        {count > 0 && (
                          <span
                            className={cn(
                              'rounded-full px-1.5 py-0.5 text-[9px] font-black',
                              isActive
                                ? `${cfg.bg} ${cfg.color}`
                                : 'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]',
                            )}
                          >
                            {count}
                          </span>
                        )}
                        {isActive && (
                          <motion.span
                            className={cn('text-xs font-bold', cfg.color)}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* ── Show/Hide toggles ── */}
              <div className="p-4">
                <FilterSectionLabel
                  icon={<Calendar className="size-3.5" />}
                  label="Display"
                  count={0}
                />
                <div className="mt-3 flex flex-col gap-3">
                  {/* Meetings toggle */}
                  <ToggleCard
                    icon={<Video className="size-4" />}
                    label="Meetings"
                    description="Team & 1:1 meetings"
                    color="#8b5cf6"
                    isOn={filters.showMeetings}
                    onToggle={() => onUpdateFilters({ showMeetings: !filters.showMeetings })}
                  />
                  {/* Holidays toggle */}
                  <ToggleCard
                    icon={<Palmtree className="size-4" />}
                    label="Holidays"
                    description="National & company days"
                    color="#0891b2"
                    isOn={filters.showHolidays}
                    onToggle={() => onUpdateFilters({ showHolidays: !filters.showHolidays })}
                  />

                  {/* Divider + summary */}
                  <div className="mt-1 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] p-3">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
                      Filter Summary
                    </p>
                    <div className="flex flex-col gap-1">
                      <SummaryRow label="Showing tasks" value={`${allTasks.length}`} />
                      <SummaryRow
                        label="Overdue"
                        value={`${countByStatus['overdue'] ?? 0}`}
                        valueColor="text-red-500"
                      />
                      <SummaryRow
                        label="In review"
                        value={`${countByStatus['ready_for_review'] ?? 0}`}
                        valueColor="text-amber-500"
                      />
                      <SummaryRow
                        label="Completed"
                        value={`${countByStatus['completed'] ?? 0}`}
                        valueColor="text-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active filter chips ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {(allChips.length > 0 || activeAssigneeChips.length > 0) && (
          <motion.div
            className="flex flex-wrap items-center gap-1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <span className="text-[10px] font-semibold text-[var(--dw-color-ink-tertiary)]">
              Active:
            </span>

            {activeAssigneeChips.map((chip) =>
              chip ? (
                <motion.button
                  key={chip.key}
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 rounded-full py-0.5 pl-1 pr-2 text-[10px] font-semibold text-white shadow-sm"
                  style={{ background: chip.avatarColor }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex size-4 items-center justify-center rounded-full bg-white/25 text-[8px] font-black">
                    {chip.initials}
                  </span>
                  {chip.label}
                  <X className="size-2.5 opacity-70" />
                </motion.button>
              ) : null,
            )}

            {allChips.map((chip) => (
              <motion.button
                key={chip.key}
                onClick={chip.onRemove}
                className={cn(
                  'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                  chip.bg,
                  chip.color,
                )}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
              >
                {chip.label}
                <X className="size-2.5 opacity-60" />
              </motion.button>
            ))}

            <button
              onClick={() => { onResetFilters(); setActivePreset('all') }}
              className="text-[10px] font-semibold text-[var(--dw-color-ink-tertiary)] underline-offset-2 hover:text-red-500 hover:underline"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterSectionLabel({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-[var(--dw-color-brand-primary)]">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
          {label}
        </span>
      </div>
      {count > 0 && (
        <span className="rounded-full bg-[var(--dw-color-brand-primary)] px-1.5 py-0.5 text-[9px] font-black text-white">
          {count}
        </span>
      )}
    </div>
  )
}

function ToggleCard({
  icon,
  label,
  description,
  color,
  isOn,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  description: string
  color: string
  isOn: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200',
        isOn
          ? 'border-transparent shadow-[var(--dw-shadow-xs)]'
          : 'border-[var(--dw-color-border-default)] opacity-50',
      )}
      style={
        isOn ? { background: `${color}12`, borderColor: `${color}30` } : {}
      }
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
        style={{ background: isOn ? color : 'var(--dw-color-surface-sunken)', color: isOn ? 'white' : 'var(--dw-color-ink-tertiary)' }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--dw-color-ink-primary)]">{label}</p>
        <p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">{description}</p>
      </div>
      {/* Toggle pill */}
      <div
        className="relative h-5 w-9 shrink-0 rounded-full transition-all duration-200"
        style={{ background: isOn ? color : 'var(--dw-color-surface-sunken)' }}
      >
        <motion.div
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
          animate={{ left: isOn ? '18px' : '2px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      </div>
    </motion.button>
  )
}

function SummaryRow({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-[var(--dw-color-ink-tertiary)]">{label}</span>
      <span className={cn('text-[10px] font-bold', valueColor ?? 'text-[var(--dw-color-ink-primary)]')}>
        {value}
      </span>
    </div>
  )
}
