import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { CalendarTask, TaskStatus } from '@/features/calendar/types/calendar.types'
import { STATUS_CONFIG } from '@/features/calendar/types/calendar.types'
import { TaskCard } from './task-card'

const BOARD_COLUMNS: TaskStatus[] = [
  'todo',
  'in_progress',
  'ready_for_review',
  'needs_revision',
  'overdue',
  'completed',
]

interface TaskBoardProps {
  tasks: CalendarTask[]
  onTaskClick: (task: CalendarTask) => void
  canDragTask: (task: CalendarTask) => boolean
  onChangeStatus: (taskId: string, status: TaskStatus) => void
  canCreateTask: boolean
  onCreateTask: () => void
}

export function TaskBoard({
  tasks,
  onTaskClick,
  canDragTask,
  onChangeStatus,
  canCreateTask,
  onCreateTask,
}: TaskBoardProps) {
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<TaskStatus, CalendarTask[]>()
    tasks.forEach((t) => {
      const list = map.get(t.status) ?? []
      list.push(t)
      map.set(t.status, list)
    })
    return map
  }, [tasks])

  const columns = useMemo(() => {
    const extras: TaskStatus[] = []
    grouped.forEach((items, status) => {
      if (!BOARD_COLUMNS.includes(status) && items.length > 0) extras.push(status)
    })
    return [...BOARD_COLUMNS, ...extras]
  }, [grouped])

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] py-16 text-center">
        <motion.div
          className="flex size-16 items-center justify-center rounded-3xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[#edf5f8] to-[var(--dw-color-surface-sunken)] shadow-lg"
          animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="text-3xl">📋</span>
        </motion.div>
        <div>
          <p className="text-sm font-bold text-[var(--dw-color-ink-secondary)]">No tasks match your filters</p>
          <p className="text-xs text-[var(--dw-color-ink-tertiary)]">Try adjusting search or status filters</p>
        </div>
        {canCreateTask && (
          <motion.button
            onClick={onCreateTask}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--dw-color-brand-primary)] to-[#3d6779] px-5 py-2.5 text-xs font-bold text-white shadow-[var(--dw-shadow-brand)]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="size-3.5" />
            Create a task
          </motion.button>
        )}
      </div>
    )
  }

  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:snap-none">
      {columns.map((status, colIdx) => {
        const items = (grouped.get(status) ?? []).slice().sort((a, b) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        const cfg = STATUS_CONFIG[status]
        const isDragOver = dragOverStatus === status

        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: colIdx * 0.04 }}
            className={cn(
              'flex w-[calc(100vw-3rem)] max-w-[300px] shrink-0 snap-start flex-col rounded-2xl border bg-[var(--dw-color-surface-sunken)]/40 transition-colors sm:w-[270px]',
              isDragOver
                ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-muted)]/50'
                : 'border-[var(--dw-color-border-default)]',
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverStatus(status)
            }}
            onDragLeave={() => setDragOverStatus((s) => (s === status ? null : s))}
            onDrop={(e) => {
              e.preventDefault()
              setDragOverStatus(null)
              const taskId = draggingId ?? e.dataTransfer.getData('text/task-id')
              if (taskId) onChangeStatus(taskId, status)
              setDraggingId(null)
            }}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className={cn('text-sm leading-none', cfg.color)}>{cfg.icon}</span>
                <span className="text-[11px] font-bold text-[var(--dw-color-ink-primary)]">{cfg.label}</span>
              </div>
              <span className="rounded-full bg-[var(--dw-color-surface-base)] px-1.5 py-0.5 text-[10px] font-black text-[var(--dw-color-ink-tertiary)]">
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex min-h-[90px] flex-1 flex-col gap-2 px-2 pb-3">
              <AnimatePresence mode="popLayout">
                {items.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    draggable={canDragTask(task)}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/task-id', task.id)
                      e.dataTransfer.effectAllowed = 'move'
                      setDraggingId(task.id)
                    }}
                    onDragEnd={() => setDraggingId(null)}
                  />
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[var(--dw-color-border-default)]/70 py-8 text-[10px] text-[var(--dw-color-ink-tertiary)]">
                  Drop tasks here
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
