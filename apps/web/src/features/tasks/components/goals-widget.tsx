import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Check, ChevronDown, RotateCcw, Target, Trash2, X } from 'lucide-react'
import { BorderBeam } from '@/shared/components/effects/border-beam'
import { cn } from '@/shared/lib/utils'
import { useGoals } from '../hooks/use-goals'
import type { Goal } from '../types/goal.types'

function progressColor(value: number): string {
  if (value >= 100) return '#10b981'
  if (value > 60) return '#4a7c92'
  if (value > 30) return '#f59e0b'
  return '#94a3b8'
}

function dueLabel(dateStr?: string): { text: string; overdue: boolean } | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  if (Number.isNaN(target.getTime())) return null
  target.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, overdue: true }
  if (diffDays === 0) return { text: 'Due today', overdue: false }
  if (diffDays === 1) return { text: 'Due tomorrow', overdue: false }
  return { text: `${diffDays}d left`, overdue: false }
}

/** A click-to-set progress bar, mirroring the interaction pattern used in TaskDrawer. */
function GoalProgressBar({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    onChange(Math.min(100, Math.max(0, pct)))
  }

  const color = progressColor(value)

  return (
    <div className="flex items-center gap-2">
      <div
        ref={ref}
        onClick={handleClick}
        className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-[var(--dw-color-surface-sunken)]"
        title="Click to update progress"
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-[9px] font-bold" style={{ color }}>
        {value}%
      </span>
    </div>
  )
}

function GoalRow({
  goal,
  onProgressChange,
  onComplete,
  onDelete,
}: {
  goal: Goal
  onProgressChange: (v: number) => void
  onComplete: () => void
  onDelete: () => void
}) {
  const due = dueLabel(goal.targetDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      className="group flex flex-col gap-1.5 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-[var(--dw-color-ink-primary)]" title={goal.title}>
            {goal.title}
          </p>
          {due && (
            <p
              className={cn(
                'mt-0.5 flex items-center gap-1 text-[9px] font-medium',
                due.overdue ? 'text-red-500' : 'text-[var(--dw-color-ink-tertiary)]',
              )}
            >
              <Calendar className="size-2.5" />
              {due.text}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onComplete}
            title="Mark complete"
            className="flex size-5 items-center justify-center rounded-md text-[var(--dw-color-ink-tertiary)] hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Check className="size-3" strokeWidth={2.5} />
          </button>
          <button
            onClick={onDelete}
            title="Delete goal"
            className="flex size-5 items-center justify-center rounded-md text-[var(--dw-color-ink-tertiary)] hover:bg-red-50 hover:text-red-500"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
      <GoalProgressBar value={goal.progress} onChange={onProgressChange} />
    </motion.div>
  )
}

/**
 * Personal goals widget — each person sets and tracks their own objectives,
 * separate from formally assigned tasks. Private, per-user, persisted locally.
 */
export function GoalsWidget() {
  const { activeGoals, completedGoals, addGoal, updateProgress, setStatus, deleteGoal } = useGoals()
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  const handleAdd = () => {
    if (!title.trim()) return
    addGoal(title, targetDate || undefined)
    setTitle('')
    setTargetDate('')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-surface-base)] to-[#fff8ec]/40 p-4 shadow-[var(--dw-shadow-sm)]">
      <BorderBeam size={100} duration={13} colorFrom="#f59e0b" colorTo="#7c3aed" borderWidth={1} />

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white shadow-sm">
            <Target className="size-3.5" />
          </span>
          <div>
            <p className="text-xs font-bold text-[var(--dw-color-ink-primary)]">My Goals</p>
            <p className="text-[9px] text-[var(--dw-color-ink-tertiary)]">Personal objectives</p>
          </div>
        </div>
        {(activeGoals.length > 0 || completedGoals.length > 0) && (
          <span className="rounded-full bg-[var(--dw-color-surface-sunken)] px-2 py-0.5 text-[10px] font-bold text-[var(--dw-color-ink-tertiary)]">
            {completedGoals.length}/{activeGoals.length + completedGoals.length}
          </span>
        )}
      </div>

      {/* Add form */}
      <div className="mb-3 flex flex-col gap-1.5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="Set a new goal…"
          className="w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-2.5 py-1.5 text-xs text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[var(--dw-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/10"
        />
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="flex-1 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-2 py-1.5 text-[10px] text-[var(--dw-color-ink-primary)] transition-colors focus:border-[var(--dw-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/10"
            title="Target date (optional)"
          />
          <motion.button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="flex h-[30px] shrink-0 items-center justify-center rounded-lg bg-[#f59e0b] px-3 text-[10px] font-bold text-white transition-all disabled:opacity-40"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            Add
          </motion.button>
        </div>
      </div>

      {/* Active goals */}
      {activeGoals.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-[var(--dw-color-border-default)] py-6 text-center">
          <span className="text-lg opacity-50">🎯</span>
          <p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">
            No active goals — set one above
          </p>
        </div>
      ) : (
        <div className="flex max-h-[280px] flex-col gap-1.5 overflow-y-auto">
          <AnimatePresence initial={false}>
            {activeGoals.map((goal) => (
              <GoalRow
                key={goal.id}
                goal={goal}
                onProgressChange={(v) => updateProgress(goal.id, v)}
                onComplete={() => updateProgress(goal.id, 100)}
                onDelete={() => deleteGoal(goal.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed goals — collapsible */}
      {completedGoals.length > 0 && (
        <div className="mt-3 border-t border-[var(--dw-color-border-default)] pt-2.5">
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="flex w-full items-center justify-between text-[10px] font-semibold text-[var(--dw-color-ink-tertiary)] transition-colors hover:text-[var(--dw-color-ink-secondary)]"
          >
            <span className="flex items-center gap-1">
              ✅ {completedGoals.length} completed
            </span>
            <ChevronDown className={cn('size-3 transition-transform', showCompleted && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex flex-col gap-1 overflow-hidden"
              >
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
                  >
                    <span className="text-[10px] text-emerald-500">✓</span>
                    <span className="min-w-0 flex-1 truncate text-[10px] text-[var(--dw-color-ink-tertiary)] line-through">
                      {goal.title}
                    </span>
                    <button
                      onClick={() => setStatus(goal.id, 'active')}
                      title="Reopen goal"
                      className="flex size-4 shrink-0 items-center justify-center rounded text-[var(--dw-color-ink-tertiary)] hover:text-[var(--dw-color-brand-primary)]"
                    >
                      <RotateCcw className="size-2.5" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      title="Delete goal"
                      className="flex size-4 shrink-0 items-center justify-center rounded text-[var(--dw-color-ink-tertiary)] hover:text-red-500"
                    >
                      <Trash2 className="size-2.5" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
