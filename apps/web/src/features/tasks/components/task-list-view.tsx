import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { CalendarTask } from '@/features/calendar/types/calendar.types'
import { TaskCard } from './task-card'

interface TaskListViewProps {
  tasks: CalendarTask[]
  onTaskClick: (task: CalendarTask) => void
  canCreateTask: boolean
  onCreateTask: () => void
}

export function TaskListView({ tasks, onTaskClick, canCreateTask, onCreateTask }: TaskListViewProps) {
  const sorted = [...tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] py-16 text-center">
        <span className="text-3xl opacity-50">📋</span>
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
    <div className="flex flex-col gap-1.5">
      <AnimatePresence mode="popLayout">
        {sorted.map((task) => (
          <TaskCard key={task.id} task={task} variant="list" onClick={() => onTaskClick(task)} />
        ))}
      </AnimatePresence>
    </div>
  )
}
