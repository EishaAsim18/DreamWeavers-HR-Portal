import { motion } from 'framer-motion'
import { AlertCircle, MessageSquare, Paperclip } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { CalendarTask } from '@/features/calendar/types/calendar.types'
import { PRIORITY_CONFIG, PRIORITY_FC_COLORS, STATUS_CONFIG } from '@/features/calendar/types/calendar.types'
import { getPerson } from '@/features/calendar/data/calendar.mock'

interface TaskCardProps {
  task: CalendarTask
  onClick: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
  variant?: 'board' | 'list'
}

export function TaskCard({
  task,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd,
  variant = 'board',
}: TaskCardProps) {
  const priorityCfg = PRIORITY_CONFIG[task.priority]
  const statusCfg = STATUS_CONFIG[task.status]
  const color = PRIORITY_FC_COLORS[task.priority]
  const assignee = getPerson(task.assignedToId)

  const dueDate = new Date(task.dueDate)
  const isOverdue = dueDate < new Date() && task.status !== 'completed' && task.status !== 'cancelled'
  const dueLabel = dueDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })

  if (variant === 'list') {
    return (
      <motion.button
        onClick={onClick}
        layout
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        whileHover={{ x: 3 }}
        className="flex w-full items-center gap-3 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-2.5 text-left shadow-[var(--dw-shadow-xs)] transition-colors hover:border-[var(--dw-color-brand-primary)]/30"
        style={{ borderLeftWidth: 3, borderLeftColor: color }}
      >
        <span className={cn('shrink-0 text-sm', statusCfg.color)}>{statusCfg.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[var(--dw-color-ink-primary)]">{task.title}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            {task.labels.slice(0, 2).map((l) => (
              <span key={l} className="rounded-full bg-[var(--dw-color-surface-sunken)] px-1.5 py-0.5 text-[9px] text-[var(--dw-color-ink-tertiary)]">
                {l}
              </span>
            ))}
          </div>
        </div>
        {assignee && (
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
            style={{ background: assignee.avatarColor }}
            title={assignee.name}
          >
            {assignee.initials}
          </span>
        )}
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold',
            isOverdue ? 'bg-red-50 text-red-500' : `${priorityCfg.bg} ${priorityCfg.color}`,
          )}
        >
          {isOverdue ? 'Overdue' : dueLabel}
        </span>
        <div className="hidden w-16 shrink-0 sm:block">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--dw-color-surface-sunken)]">
            <div
              className="h-full rounded-full"
              style={{ width: `${task.completionPercent}%`, background: color }}
            />
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'group flex flex-col gap-2 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3 shadow-[var(--dw-shadow-xs)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] active:scale-[0.98]',
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
      )}
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      {/* Top row: priority badge + overdue */}
      <div className="flex items-center gap-1.5">
        <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', priorityCfg.bg, priorityCfg.color)}>
          <span className={cn('size-1.5 rounded-full', priorityCfg.dot)} />
          {priorityCfg.label}
        </span>
        {isOverdue && (
          <span className="inline-flex items-center gap-0.5 rounded-md bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-600">
            <AlertCircle className="size-2.5" />
            Overdue
          </span>
        )}
      </div>

      {/* Title */}
      <p className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--dw-color-ink-primary)]">
        {task.title}
      </p>

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.slice(0, 2).map((l) => (
            <span key={l} className="rounded-full bg-[var(--dw-color-surface-sunken)] px-1.5 py-0.5 text-[9px] text-[var(--dw-color-ink-tertiary)]">
              {l}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="rounded-full bg-[var(--dw-color-surface-sunken)] px-1.5 py-0.5 text-[9px] text-[var(--dw-color-ink-tertiary)]">
              +{task.labels.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      {task.completionPercent > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--dw-color-surface-sunken)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${task.completionPercent}%`, background: color }}
          />
        </div>
      )}

      {/* Footer: assignee + meta */}
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {assignee && (
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white shadow-sm"
              style={{ background: assignee.avatarColor }}
              title={assignee.name}
            >
              {assignee.initials}
            </span>
          )}
          <span
            className={cn(
              'text-[10px] font-bold',
              isOverdue ? 'text-red-500' : 'text-[var(--dw-color-ink-tertiary)]',
            )}
          >
            {isOverdue ? 'Overdue' : dueLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--dw-color-ink-tertiary)]">
          {task.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[9px]">
              <MessageSquare className="size-2.5" />
              {task.comments.length}
            </span>
          )}
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[9px]">
              <Paperclip className="size-2.5" />
              {task.attachments.length}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
