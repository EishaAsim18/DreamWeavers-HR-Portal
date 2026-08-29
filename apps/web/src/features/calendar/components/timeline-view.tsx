import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { CalendarTask } from '../types/calendar.types'
import { PRIORITY_FC_COLORS, STATUS_CONFIG } from '../types/calendar.types'
import { CALENDAR_PEOPLE } from '../data/calendar.mock'

interface TimelineViewProps {
  tasks: CalendarTask[]
  onTaskClick: (task: CalendarTask) => void
  currentDate?: Date
}

export function TimelineView({ tasks, onTaskClick, currentDate = new Date() }: TimelineViewProps) {
  // Show a 4-week window centered around today
  const startDate = useMemo(() => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - d.getDay()) // Start of week
    return d
  }, [currentDate])

  const days = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date(startDate)
      d.setDate(startDate.getDate() + i)
      return d
    })
  }, [startDate])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const totalDays = 28
  const dayWidth = 36 // px per day

  const getTaskBar = (task: CalendarTask) => {
    const due = new Date(task.dueDate)
    const start = new Date(task.startDate)

    const startOffset = Math.floor(
      (start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    const endOffset = Math.floor(
      (due.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const clampedStart = Math.max(0, startOffset)
    const clampedEnd = Math.min(totalDays - 1, endOffset)

    if (clampedEnd < 0 || clampedStart >= totalDays) return null

    const duration = Math.max(1, clampedEnd - clampedStart + 1)
    const color = PRIORITY_FC_COLORS[task.priority]

    return {
      left: clampedStart * dayWidth,
      width: duration * dayWidth - 4,
      color,
    }
  }

  const todayOffset = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Group tasks by assignee
  const peopleWithTasks = CALENDAR_PEOPLE.map((person) => ({
    person,
    tasks: tasks.filter((t) => t.assignedToId === person.id),
  })).filter((p) => p.tasks.length > 0)

  const monthLabel = (date: Date) =>
    date.toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })

  const contentWidth = 176 + totalDays * dayWidth // 176px = w-44 people column

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]">
      {/* Entire grid scrolls horizontally together; people column stays pinned via sticky */}
      <div className="overflow-x-auto">
      <div style={{ minWidth: contentWidth }}>
      {/* Timeline header */}
      <div className="flex border-b border-[var(--dw-color-border-default)]">
        {/* People column header */}
        <div className="sticky left-0 z-10 w-44 shrink-0 border-r border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
            Team Members
          </p>
        </div>

        {/* Days header */}
        <div>
          <div
            className="flex"
            style={{ width: totalDays * dayWidth }}
          >
            {days.map((day, i) => {
              const isToday = day.getTime() === today.getTime()
              const isFirstOfMonth = day.getDate() === 1

              return (
                <div
                  key={i}
                  className="relative flex shrink-0 flex-col items-center border-r border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] py-2"
                  style={{ width: dayWidth }}
                >
                  {isFirstOfMonth && (
                    <span className="absolute -top-5 left-0 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
                      {monthLabel(day)}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold ${
                      isToday
                        ? 'flex size-5 items-center justify-center rounded-full bg-[var(--dw-color-brand-primary)] text-white'
                        : 'text-[var(--dw-color-ink-tertiary)]'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <span className="text-[8px] text-[var(--dw-color-ink-tertiary)] opacity-60">
                    {day.toLocaleDateString('en-PK', { weekday: 'short' }).slice(0, 2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Timeline rows */}
      <div className="max-h-[450px] overflow-y-auto">
        {peopleWithTasks.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-[var(--dw-color-ink-tertiary)]">
            No tasks in this period
          </div>
        ) : (
          peopleWithTasks.map(({ person, tasks: personTasks }) => (
            <div
              key={person.id}
              className="flex border-b border-[var(--dw-color-border-default)] last:border-0"
            >
              {/* Person info */}
              <div className="sticky left-0 z-10 flex w-44 shrink-0 items-center gap-2.5 border-r border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-4 py-3">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: person.avatarColor }}
                >
                  {person.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--dw-color-ink-primary)]">
                    {person.name.split(' ')[0]}
                  </p>
                  <p className="truncate text-[9px] text-[var(--dw-color-ink-tertiary)]">
                    {person.jobTitle}
                  </p>
                </div>
              </div>

              {/* Task bars */}
              <div className="py-2">
                <div
                  className="relative"
                  style={{ width: totalDays * dayWidth, minHeight: personTasks.length * 28 + 8 }}
                >
                  {/* Today line */}
                  {todayOffset >= 0 && todayOffset < totalDays && (
                    <div
                      className="absolute top-0 bottom-0 w-px bg-[var(--dw-color-brand-primary)] opacity-40"
                      style={{ left: todayOffset * dayWidth + dayWidth / 2 }}
                    />
                  )}

                  {/* Grid lines */}
                  {days.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-[var(--dw-color-border-default)] opacity-40"
                      style={{ left: i * dayWidth }}
                    />
                  ))}

                  {/* Task bars */}
                  {personTasks.map((task, idx) => {
                    const bar = getTaskBar(task)
                    if (!bar) return null
                    const statusCfg = STATUS_CONFIG[task.status]

                    return (
                      <motion.button
                        key={task.id}
                        className="absolute flex h-6 cursor-pointer items-center gap-1 overflow-hidden rounded-md px-2 text-white transition-all hover:brightness-110"
                        style={{
                          top: idx * 28 + 4,
                          left: bar.left + 2,
                          width: bar.width,
                          background: `linear-gradient(135deg, ${bar.color}ee, ${bar.color}99)`,
                          boxShadow: `0 1px 4px ${bar.color}40`,
                        }}
                        onClick={() => onTaskClick(task)}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        whileHover={{ y: -1 }}
                        title={`${task.title} — ${statusCfg.label}`}
                      >
                        <span className="text-[9px] font-semibold opacity-90">{statusCfg.icon}</span>
                        <span className="truncate text-[10px] font-semibold leading-none">
                          {task.title}
                        </span>
                        {task.completionPercent > 0 && (
                          <span className="ml-auto shrink-0 text-[8px] font-bold opacity-80">
                            {task.completionPercent}%
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
          Priority:
        </span>
        {(['urgent', 'high', 'medium', 'low'] as const).map((p) => (
          <span key={p} className="flex items-center gap-1 text-[10px] text-[var(--dw-color-ink-tertiary)]">
            <span className="size-2 rounded-full" style={{ background: PRIORITY_FC_COLORS[p] }} />
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </span>
        ))}
      </div>
    </div>
  )
}
