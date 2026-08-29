import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, Tag, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { CalendarTask, TaskPriority, TaskStatus, TaskFormData } from '../types/calendar.types'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../types/calendar.types'
import { CALENDAR_PEOPLE } from '../data/calendar.mock'
import type { useCalendarPermissions } from '../hooks/use-calendar-permissions'
import type { useCalendarStore } from '../hooks/use-calendar-store'

type Perms = ReturnType<typeof useCalendarPermissions>
type Store = ReturnType<typeof useCalendarStore>

const AVAILABLE_LABELS = [
  'Q3', 'Q2', 'Engineering', 'HR', 'Product', 'Design', 'DevOps',
  'Security', 'Analytics', 'Documentation', 'Strategy', 'Events',
  'Infrastructure', 'Sales', 'Marketing', 'Finance',
]

const TASK_STATUSES: TaskStatus[] = [
  'todo', 'in_progress', 'ready_for_review', 'needs_revision', 'completed', 'cancelled',
]

const TASK_PRIORITIES: TaskPriority[] = ['urgent', 'high', 'medium', 'low']

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingTask: CalendarTask | null
  defaultDate: string
  store: Store
  perms: Perms
}

// ── Field Components ──────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-[var(--dw-color-ink-secondary)]">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  )
}

function FieldInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-2 text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[var(--dw-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/10',
        props.className,
      )}
    />
  )
}

function FieldTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full resize-none rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-2 text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[var(--dw-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/10',
        props.className,
      )}
    />
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export function TaskFormModal({ isOpen, onClose, editingTask, defaultDate, store, perms }: TaskFormModalProps) {
  const isEditing = !!editingTask

  const [form, setForm] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    labels: [],
    assignedToId: '',
    reviewerId: '',
    startDate: defaultDate,
    dueDate: defaultDate,
    estimatedHours: 4,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})

  // Pre-fill when editing
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        labels: editingTask.labels,
        assignedToId: editingTask.assignedToId,
        reviewerId: editingTask.reviewerId ?? '',
        startDate: editingTask.startDate,
        dueDate: editingTask.dueDate,
        estimatedHours: editingTask.estimatedHours,
      })
    } else {
      setForm((prev) => ({ ...prev, startDate: defaultDate, dueDate: defaultDate }))
    }
    setErrors({})
  }, [editingTask, defaultDate, isOpen])

  const set = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e })
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof TaskFormData, string>> = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.assignedToId) e.assignedToId = 'Please assign this task'
    if (!form.dueDate) e.dueDate = 'Due date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (isEditing && editingTask) {
      store.updateTask(editingTask.id, form)
    } else {
      store.createTask(form)
    }
    onClose()
  }

  // Assignable users (role-filtered)
  const assignableUsers = CALENDAR_PEOPLE.filter((p) => perms.canAssignTo(p.id))

  const toggleLabel = (label: string) => {
    set('labels', form.labels.includes(label)
      ? form.labels.filter((l) => l !== label)
      : [...form.labels, label])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">
                  {isEditing ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-xs text-[var(--dw-color-ink-tertiary)]">
                  {isEditing ? 'Update task details' : 'Fill in the details to create a new task'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-4 px-5 py-4">
                {/* Title */}
                <div>
                  <FieldLabel required>Task Title</FieldLabel>
                  <FieldInput
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Enter a clear, descriptive title…"
                    autoFocus
                  />
                  {errors.title && <FieldError>{errors.title}</FieldError>}
                </div>

                {/* Description */}
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <FieldTextarea
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Add more context about this task…"
                    rows={3}
                  />
                </div>

                {/* Priority + Status row */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Priority</FieldLabel>
                    <div className="flex flex-col gap-1">
                      {TASK_PRIORITIES.map((p) => {
                        const cfg = PRIORITY_CONFIG[p]
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => set('priority', p)}
                            className={cn(
                              'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                              form.priority === p
                                ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                                : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)] hover:border-[var(--dw-color-brand-primary)]/30',
                            )}
                          >
                            <span className={cn('size-2 rounded-full', cfg.dot)} />
                            {cfg.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <div className="flex flex-col gap-1">
                      {TASK_STATUSES.slice(0, 4).map((s) => {
                        const cfg = STATUS_CONFIG[s]
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => set('status', s)}
                            className={cn(
                              'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                              form.status === s
                                ? `${cfg.bg} border-transparent ${cfg.color}`
                                : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)] hover:border-[var(--dw-color-brand-primary)]/30',
                            )}
                          >
                            <span>{cfg.icon}</span>
                            {cfg.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Assign To */}
                <div>
                  <FieldLabel required>
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5" /> Assign To
                    </span>
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {assignableUsers.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => set('assignedToId', p.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                          form.assignedToId === p.id
                            ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]'
                            : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)] hover:border-[var(--dw-color-brand-primary)]/30',
                        )}
                      >
                        <span
                          className="flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                          style={{ background: p.avatarColor }}
                        >
                          {p.initials}
                        </span>
                        {p.name.split(' ')[0]}
                        <span className="text-[9px] opacity-60 capitalize">{p.role.replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                  {errors.assignedToId && <FieldError>{errors.assignedToId}</FieldError>}
                </div>

                {/* Dates + Hours row */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <FieldLabel>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> Start Date
                      </span>
                    </FieldLabel>
                    <FieldInput
                      type="date"
                      value={form.startDate}
                      onChange={(e) => set('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel required>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> Due Date
                      </span>
                    </FieldLabel>
                    <FieldInput
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => set('dueDate', e.target.value)}
                    />
                    {errors.dueDate && <FieldError>{errors.dueDate}</FieldError>}
                  </div>
                  <div>
                    <FieldLabel>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> Est. Hours
                      </span>
                    </FieldLabel>
                    <FieldInput
                      type="number"
                      min={0.5}
                      max={999}
                      step={0.5}
                      value={form.estimatedHours}
                      onChange={(e) => set('estimatedHours', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <FieldLabel>
                    <span className="flex items-center gap-1.5">
                      <Tag className="size-3.5" /> Labels
                    </span>
                  </FieldLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_LABELS.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleLabel(label)}
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all',
                          form.labels.includes(label)
                            ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]'
                            : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)] hover:border-[var(--dw-color-brand-primary)]/30',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[var(--dw-color-border-default)] px-5 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--dw-color-ink-secondary)] transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[var(--dw-color-brand-primary)] px-5 py-2 text-xs font-semibold text-white shadow-[var(--dw-shadow-brand)] transition-all hover:bg-[var(--dw-color-brand-primary-hover)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isEditing ? 'Save Changes' : 'Create Task'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
      <AlertCircle className="size-3" />
      {children}
    </p>
  )
}
