import { motion } from 'framer-motion'
import { MessageSquare, Paperclip, Video, Clock, Users } from 'lucide-react'
import type { EventContentArg } from '@fullcalendar/core'
import type { CalendarTask, CalendarMeeting, CalendarHoliday } from '../types/calendar.types'
import { PRIORITY_FC_COLORS, STATUS_CONFIG, MEETING_COLORS } from '../types/calendar.types'
import { getPerson } from '../data/calendar.mock'

function statusDotClass(status: string): string {
  const map: Record<string, string> = {
    todo: 'bg-slate-400',
    in_progress: 'bg-blue-500 animate-pulse',
    ready_for_review: 'bg-amber-400 animate-pulse',
    needs_revision: 'bg-orange-500',
    completed: 'bg-emerald-500',
    cancelled: 'bg-slate-300',
    overdue: 'bg-red-500 animate-pulse',
  }
  return map[status] ?? 'bg-slate-400'
}

function priorityGlow(priority: string): string {
  const map: Record<string, string> = {
    urgent: '0 2px 12px rgba(239,68,68,0.35)',
    high: '0 2px 10px rgba(249,115,22,0.3)',
    medium: '0 2px 8px rgba(74,124,146,0.25)',
    low: '0 1px 4px rgba(148,163,184,0.2)',
  }
  return map[priority] ?? 'none'
}

// ── Task Event Card ───────────────────────────────────────────────────────────

function TaskEventCard({ task, viewType }: { task: CalendarTask; viewType: string }) {
  const color = PRIORITY_FC_COLORS[task.priority]
  const statusCfg = STATUS_CONFIG[task.status]
  const isMonthView = viewType === 'dayGridMonth'
  const isTimeGrid = viewType === 'timeGridWeek' || viewType === 'timeGridDay'
  const assignee = getPerson(task.assignedToId)
  const isUrgent = task.priority === 'urgent'

  if (isMonthView) {
    return (
      <motion.div
        className={`group flex h-[22px] w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-[6px] px-1.5 ${isUrgent ? 'fc-event-urgent' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${color}30 0%, ${color}12 60%, ${color}08 100%)`,
          borderLeft: `3px solid ${color}`,
          boxShadow: priorityGlow(task.priority),
        }}
        whileHover={{ scale: 1.02, y: -1, boxShadow: `0 4px 16px ${color}40` }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span className={`size-1.5 shrink-0 rounded-full ${statusDotClass(task.status)}`} />
        <span className="flex-1 truncate text-[11px] font-bold leading-none" style={{ color }}>
          {task.title}
        </span>
        {task.completionPercent > 0 && task.completionPercent < 100 && (
          <span className="shrink-0 rounded px-0.5 text-[8px] font-black text-white" style={{ background: color }}>
            {task.completionPercent}%
          </span>
        )}
        {task.completionPercent === 100 && <span className="shrink-0 text-[10px] text-emerald-500">✓</span>}
      </motion.div>
    )
  }

  if (isTimeGrid) {
    return (
      <motion.div
        className="flex h-full w-full flex-col gap-1 overflow-hidden rounded-xl p-2"
        style={{
          background: `linear-gradient(160deg, ${color}35 0%, ${color}15 50%, ${color}08 100%)`,
          borderLeft: `4px solid ${color}`,
          boxShadow: priorityGlow(task.priority),
        }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        <div className="flex items-start gap-1">
          <span className={`mt-0.5 size-2 shrink-0 rounded-full ${statusDotClass(task.status)}`} />
          <span className="line-clamp-2 flex-1 text-[11px] font-bold leading-tight" style={{ color }}>
            {task.title}
          </span>
        </div>

        {task.completionPercent > 0 && (
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: `${color}20` }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
              initial={{ width: 0 }}
              animate={{ width: `${task.completionPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-1">
          {assignee && (
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-black text-white shadow-md ring-2 ring-white/50"
              style={{ background: assignee.avatarColor }}
              title={assignee.name}
            >
              {assignee.initials.slice(0, 1)}
            </span>
          )}
          <span
            className="ml-auto rounded-md px-1.5 py-0.5 text-[8px] font-bold"
            style={{ background: `${color}25`, color }}
          >
            {statusCfg.icon} {statusCfg.label}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex w-full items-center gap-2.5 py-1"
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="size-3 shrink-0 rounded-full ring-2 ring-white/60" style={{ background: color, boxShadow: priorityGlow(task.priority) }} />
      <span className="flex-1 truncate text-[12px] font-bold" style={{ color }}>{task.title}</span>
      {task.comments.length > 0 && (
        <span className="flex items-center gap-0.5 rounded-full bg-[var(--dw-color-surface-sunken)] px-1.5 py-0.5 text-[9px] text-[var(--dw-color-ink-tertiary)]">
          <MessageSquare className="size-2.5" />{task.comments.length}
        </span>
      )}
      {task.attachments.length > 0 && (
        <span className="flex items-center gap-0.5 rounded-full bg-[var(--dw-color-surface-sunken)] px-1.5 py-0.5 text-[9px] text-[var(--dw-color-ink-tertiary)]">
          <Paperclip className="size-2.5" />{task.attachments.length}
        </span>
      )}
      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${color}18`, color }}>
        {statusCfg.label}
      </span>
    </motion.div>
  )
}

// ── Meeting Event Card ────────────────────────────────────────────────────────

function MeetingEventCard({ meeting, viewType }: { meeting: CalendarMeeting; viewType: string }) {
  const color = MEETING_COLORS[meeting.meetingType]
  const isMonthView = viewType === 'dayGridMonth'
  const isTimeGrid = viewType === 'timeGridWeek' || viewType === 'timeGridDay'
  const startTime = new Date(meeting.startDate).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })

  if (isMonthView) {
    return (
      <motion.div
        className="flex h-[22px] w-full items-center gap-1.5 overflow-hidden rounded-[6px] px-1.5"
        style={{
          background: `linear-gradient(135deg, ${color}28 0%, ${color}10 100%)`,
          borderLeft: `3px solid ${color}`,
          boxShadow: `0 2px 8px ${color}25`,
        }}
        whileHover={{ scale: 1.02, y: -1 }}
      >
        <Video className="size-2.5 shrink-0" style={{ color }} />
        <span className="truncate text-[11px] font-bold leading-none" style={{ color }}>{meeting.title}</span>
      </motion.div>
    )
  }

  if (isTimeGrid) {
    return (
      <motion.div
        className="flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-2"
        style={{
          background: `linear-gradient(160deg, ${color}30 0%, ${color}12 100%)`,
          borderLeft: `4px solid ${color}`,
          boxShadow: `0 2px 10px ${color}20`,
        }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="flex items-center gap-1.5">
          <Video className="size-3.5 shrink-0" style={{ color }} />
          <span className="line-clamp-2 flex-1 text-[11px] font-bold leading-tight" style={{ color }}>
            {meeting.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color }}>
            <Clock className="size-2.5" />{startTime}
          </span>
          <span className="flex items-center gap-0.5 text-[9px] font-semibold opacity-70" style={{ color }}>
            <Users className="size-2.5" />{meeting.attendeeIds.length}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div className="flex w-full items-center gap-2.5 py-1" whileHover={{ x: 4 }}>
      <Video className="size-3.5 shrink-0" style={{ color }} />
      <span className="flex-1 truncate text-[12px] font-bold" style={{ color }}>{meeting.title}</span>
      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${color}18`, color }}>{startTime}</span>
    </motion.div>
  )
}

// ── Holiday Event Card ────────────────────────────────────────────────────────

function HolidayEventCard({ holiday }: { holiday: CalendarHoliday }) {
  const color = holiday.holidayType === 'national' ? '#0891b2' : '#4a7c92'
  return (
    <motion.div
      className="flex h-[20px] w-full items-center gap-1.5 overflow-hidden rounded-[5px] px-1.5"
      style={{
        background: `repeating-linear-gradient(135deg, ${color}15, ${color}15 4px, ${color}08 4px, ${color}08 8px)`,
        borderLeft: `3px solid ${color}`,
      }}
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <span className="truncate text-[10px] font-bold italic" style={{ color }}>{holiday.title}</span>
    </motion.div>
  )
}

// ── Unified renderer ──────────────────────────────────────────────────────────

export function CalendarEventContent({ arg }: { arg: EventContentArg }) {
  const event = arg.event.extendedProps.calendarEvent as
    | CalendarTask | CalendarMeeting | CalendarHoliday | undefined

  if (!event) return null

  const viewType = arg.view.type
  const delay = Math.min((arg.event.start?.getTime() ?? 0) % 500 / 1000, 0.15)

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, scale: 0.92, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18, delay, type: 'spring', stiffness: 400, damping: 28 }}
    >
      {event.calendarType === 'task' && <TaskEventCard task={event} viewType={viewType} />}
      {event.calendarType === 'meeting' && <MeetingEventCard meeting={event} viewType={viewType} />}
      {event.calendarType === 'holiday' && <HolidayEventCard holiday={event} />}
    </motion.div>
  )
}
