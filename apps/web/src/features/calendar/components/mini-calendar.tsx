import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Video, AlertCircle } from 'lucide-react'
import { BorderBeam } from '@/shared/components/effects/border-beam'
import type { CalendarTask, CalendarMeeting, CalendarHoliday } from '../types/calendar.types'
import { PRIORITY_FC_COLORS, STATUS_CONFIG } from '../types/calendar.types'
import { getPerson } from '../data/calendar.mock'

interface MiniCalendarProps {
  tasks: CalendarTask[]
  meetings: CalendarMeeting[]
  holidays: CalendarHoliday[]
  onDateClick: (date: Date) => void
  currentUserId?: string
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────

export function MiniCalendar({
  tasks,
  meetings,
  holidays,
  onDateClick,
  currentUserId: _currentUserId,
}: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  // Build calendar grid
  const { days, prevMonthDays, nextMonthDays } = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay() // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev = new Date(year, month, 0).getDate()

    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
    const prevMonthDays = Array.from({ length: firstDay }, (_, i) =>
      new Date(year, month - 1, daysInPrev - firstDay + i + 1),
    )
    const totalShown = prevMonthDays.length + days.length
    const nextMonthDays = Array.from({ length: (7 - (totalShown % 7)) % 7 }, (_, i) =>
      new Date(year, month + 1, i + 1),
    )

    return { days, prevMonthDays, nextMonthDays }
  }, [viewDate])

  // Event dots map: dateStr → priority colors
  const eventMap = useMemo(() => {
    const map: Record<string, { colors: string[]; hasHoliday: boolean; hasMeeting: boolean }> = {}

    tasks.forEach((t) => {
      const key = t.dueDate.split('T')[0]
      if (!map[key]) map[key] = { colors: [], hasHoliday: false, hasMeeting: false }
      if (map[key].colors.length < 3) {
        map[key].colors.push(PRIORITY_FC_COLORS[t.priority])
      }
    })

    meetings.forEach((m) => {
      const key = m.startDate.split('T')[0]
      if (!map[key]) map[key] = { colors: [], hasHoliday: false, hasMeeting: false }
      map[key].hasMeeting = true
    })

    holidays.forEach((h) => {
      const key = h.date
      if (!map[key]) map[key] = { colors: [], hasHoliday: false, hasMeeting: false }
      map[key].hasHoliday = true
    })

    return map
  }, [tasks, meetings, holidays])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick(date)
  }

  const navMonth = (dir: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + dir, 1))
  }

  const isToday = (d: Date) => d.getTime() === today.getTime()
  const isSelected = (d: Date) =>
    selectedDate?.toDateString() === d.toDateString()

  const monthTitle = viewDate.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })

  // ── Upcoming items for today / next 7 days ─────────────────────────────────
  const upcomingItems = useMemo(() => {
    const now = new Date()
    const end = new Date(now)
    end.setDate(now.getDate() + 7)

    const taskItems = tasks
      .filter((t) => {
        const d = new Date(t.dueDate)
        return d >= now && d <= end && t.status !== 'completed' && t.status !== 'cancelled'
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)

    const meetingItems = meetings
      .filter((m) => {
        const d = new Date(m.startDate)
        return d >= now && d <= end
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3)

    return { tasks: taskItems, meetings: meetingItems }
  }, [tasks, meetings])

  // ── Stats for today ─────────────────────────────────────────────────────────
  const todayKey = today.toISOString().split('T')[0]
  const todayTaskCount = tasks.filter(
    (t) => t.dueDate.split('T')[0] === todayKey && t.status !== 'completed',
  ).length
  const todayMeetingCount = meetings.filter(
    (m) => m.startDate.split('T')[0] === todayKey,
  ).length
  const overdueCount = tasks.filter((t) => t.status === 'overdue').length

  return (
    <div className="flex flex-col gap-4">
      {/* ── Mini calendar card ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-surface-base)] to-[#edf5f8]/30 p-4 shadow-[var(--dw-shadow-sm)]">
        <BorderBeam size={100} duration={10} colorFrom="#4a7c92" colorTo="#7c3aed" borderWidth={1} />
        {/* Month nav */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navMonth(-1)}
            className="flex size-6 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-ink-primary)]"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <AnimatePresence mode="wait">
            <motion.span
              key={monthTitle}
              className="text-xs font-bold text-[var(--dw-color-ink-primary)]"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
            >
              {monthTitle}
            </motion.span>
          </AnimatePresence>
          <button
            onClick={() => navMonth(1)}
            className="flex size-6 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-ink-primary)]"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[9px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={monthTitle}
            className="grid grid-cols-7 gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {/* Previous month days */}
            {prevMonthDays.map((d, i) => (
              <DayCell
                key={`prev-${i}`}
                date={d}
                isToday={false}
                isSelected={isSelected(d)}
                isCurrentMonth={false}
                events={eventMap[d.toISOString().split('T')[0]]}
                onClick={() => handleDateClick(d)}
              />
            ))}

            {/* Current month days */}
            {days.map((d) => (
              <DayCell
                key={d.getDate()}
                date={d}
                isToday={isToday(d)}
                isSelected={isSelected(d)}
                isCurrentMonth
                events={eventMap[d.toISOString().split('T')[0]]}
                onClick={() => handleDateClick(d)}
              />
            ))}

            {/* Next month days */}
            {nextMonthDays.map((d, i) => (
              <DayCell
                key={`next-${i}`}
                date={d}
                isToday={false}
                isSelected={isSelected(d)}
                isCurrentMonth={false}
                events={eventMap[d.toISOString().split('T')[0]]}
                onClick={() => handleDateClick(d)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Today at a glance ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-brand-primary-muted)]/50 to-[var(--dw-color-surface-base)] p-4 shadow-[var(--dw-shadow-sm)]">
        <BorderBeam size={80} duration={12} delay={1} colorFrom="#0891b2" colorTo="#4a7c92" borderWidth={1} />
        <div className="mb-3 flex items-center gap-2">
          <motion.div
            className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--dw-color-brand-primary)] to-[#3d6779] shadow-[var(--dw-shadow-brand)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-xs font-black text-white">{today.getDate()}</span>
          </motion.div>
          <div>
            <p className="text-xs font-bold text-[var(--dw-color-ink-primary)]">
              Today
            </p>
            <p className="text-[9px] text-[var(--dw-color-ink-tertiary)]">
              {today.toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <TodayStat
            value={todayTaskCount}
            label="Tasks due"
            color="text-[#4a7c92]"
            bg="bg-[#edf5f8]"
          />
          <TodayStat
            value={todayMeetingCount}
            label="Meetings"
            color="text-violet-600"
            bg="bg-violet-50"
          />
          {overdueCount > 0 && (
            <TodayStat
              value={overdueCount}
              label="Overdue"
              color="text-red-500"
              bg="bg-red-50"
            />
          )}
        </div>
      </div>

      {/* ── Upcoming tasks ────────────────────────────────────────────────── */}
      {(upcomingItems.tasks.length > 0 || upcomingItems.meetings.length > 0) && (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-4 shadow-[var(--dw-shadow-sm)]">
          <BorderBeam size={90} duration={14} delay={2} colorFrom="#7c3aed" colorTo="#0891b2" borderWidth={1} />
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
            Upcoming · 7 days
          </p>

          <div className="flex flex-col gap-1.5">
            {/* Meetings first */}
            {upcomingItems.meetings.map((m) => (
              <UpcomingMeetingRow key={m.id} meeting={m} />
            ))}
            {/* Tasks */}
            {upcomingItems.tasks.map((t) => (
              <UpcomingTaskRow key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Day Cell ──────────────────────────────────────────────────────────────────

function DayCell({
  date,
  isToday,
  isSelected,
  isCurrentMonth,
  events,
  onClick,
}: {
  date: Date
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  events?: { colors: string[]; hasHoliday: boolean; hasMeeting: boolean }
  onClick: () => void
}) {
  const hasEvents = events && (events.colors.length > 0 || events.hasMeeting || events.hasHoliday)

  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center rounded-lg p-1 transition-all"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Holiday background */}
      {events?.hasHoliday && !isToday && !isSelected && (
        <div className="absolute inset-0.5 rounded-md bg-[#4a7c92]/10" />
      )}

      {/* Day number */}
      <span
        className={[
          'relative z-10 flex size-6 items-center justify-center rounded-lg text-[11px] font-semibold leading-none transition-all',
          isToday
            ? 'bg-[var(--dw-color-brand-primary)] text-white shadow-md'
            : isSelected
            ? 'bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]'
            : isCurrentMonth
            ? 'text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]'
            : 'text-[var(--dw-color-ink-tertiary)] opacity-40',
        ].join(' ')}
      >
        {date.getDate()}
      </span>

      {/* Event dots */}
      {hasEvents && (
        <div className="relative z-10 mt-0.5 flex items-center gap-0.5">
          {events.hasMeeting && (
            <span className="size-1 rounded-full bg-violet-500" />
          )}
          {events.colors.slice(0, 2).map((color, i) => (
            <span key={i} className="size-1 rounded-full" style={{ background: color }} />
          ))}
          {events.colors.length > 2 && (
            <span className="size-1 rounded-full bg-[var(--dw-color-ink-tertiary)] opacity-50" />
          )}
        </div>
      )}
    </motion.button>
  )
}

// ── Upcoming rows ─────────────────────────────────────────────────────────────

function UpcomingTaskRow({ task }: { task: CalendarTask }) {
  const color = PRIORITY_FC_COLORS[task.priority]
  const statusCfg = STATUS_CONFIG[task.status]
  const dueDate = new Date(task.dueDate)
  const isOverdue = dueDate < new Date() && task.status !== 'completed'
  const assignee = getPerson(task.assignedToId)

  const daysUntil = Math.ceil(
    (dueDate.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24),
  )
  const dateLabel =
    daysUntil === 0 ? 'Today' :
    daysUntil === 1 ? 'Tomorrow' :
    `${daysUntil}d`

  return (
    <motion.div
      className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
      whileHover={{ x: 2 }}
    >
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[var(--dw-color-ink-primary)]">
          {task.title}
        </p>
        <div className="flex items-center gap-1.5">
          {assignee && (
            <span
              className="flex size-3.5 items-center justify-center rounded-full text-[7px] font-black text-white"
              style={{ background: assignee.avatarColor }}
            >
              {assignee.initials.slice(0, 1)}
            </span>
          )}
          <span className={`text-[9px] font-medium ${statusCfg.color}`}>
            {statusCfg.icon} {statusCfg.label}
          </span>
        </div>
      </div>
      <span
        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
          isOverdue ? 'bg-red-50 text-red-500' : 'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]'
        }`}
      >
        {isOverdue ? <AlertCircle className="inline size-2.5" /> : dateLabel}
      </span>
    </motion.div>
  )
}

function UpcomingMeetingRow({ meeting }: { meeting: CalendarMeeting }) {
  const start = new Date(meeting.startDate)
  const timeLabel = start.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
  const dayLabel = start.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric' })

  return (
    <motion.div
      className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
      whileHover={{ x: 2 }}
    >
      <Video className="size-3 shrink-0 text-violet-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[var(--dw-color-ink-primary)]">
          {meeting.title}
        </p>
        <p className="text-[9px] text-[var(--dw-color-ink-tertiary)]">
          {dayLabel} · {timeLabel}
        </p>
      </div>
    </motion.div>
  )
}

function TodayStat({
  value,
  label,
  color,
  bg,
}: {
  value: number
  label: string
  color: string
  bg: string
}) {
  return (
    <div className={`flex flex-1 flex-col items-center rounded-lg ${bg} py-2`}>
      <span className={`text-base font-black leading-none ${color}`}>{value}</span>
      <span className="text-[9px] text-[var(--dw-color-ink-tertiary)]">{label}</span>
    </div>
  )
}
