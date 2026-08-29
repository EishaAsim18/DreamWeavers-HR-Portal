import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ListTodo, Plus, Trash2, X } from 'lucide-react'
import { BorderBeam } from '@/shared/components/effects/border-beam'
import { cn } from '@/shared/lib/utils'
import { useTodoList } from '../hooks/use-todo-list'

/**
 * Personal quick to-do list — a lightweight private checklist that lives
 * alongside the formal Task Board. Great for reminders that don't need
 * an assignee, due date, or approval workflow.
 */
export function TodoListWidget() {
  const { items, addTodo, toggleTodo, deleteTodo, clearCompleted, completedCount, total } = useTodoList()
  const [draft, setDraft] = useState('')

  const handleAdd = () => {
    if (!draft.trim()) return
    addTodo(draft)
    setDraft('')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-surface-base)] to-[#edf5f8]/30 p-4 shadow-[var(--dw-shadow-sm)]">
      <BorderBeam size={100} duration={11} colorFrom="#7c3aed" colorTo="#4a7c92" borderWidth={1} />

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#4a7c92] text-white shadow-[var(--dw-shadow-brand)]">
            <ListTodo className="size-3.5" />
          </span>
          <div>
            <p className="text-xs font-bold text-[var(--dw-color-ink-primary)]">My To-Dos</p>
            <p className="text-[9px] text-[var(--dw-color-ink-tertiary)]">Quick personal reminders</p>
          </div>
        </div>
        {total > 0 && (
          <span className="rounded-full bg-[var(--dw-color-surface-sunken)] px-2 py-0.5 text-[10px] font-bold text-[var(--dw-color-ink-tertiary)]">
            {completedCount}/{total}
          </span>
        )}
      </div>

      {/* Add row */}
      <div className="mb-3 flex items-center gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="Add a quick to-do…"
          className="flex-1 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-2.5 py-1.5 text-xs text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[var(--dw-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/10"
        />
        <motion.button
          onClick={handleAdd}
          disabled={!draft.trim()}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--dw-color-brand-primary)] text-white transition-all disabled:opacity-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="size-3.5" />
        </motion.button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-[var(--dw-color-border-default)] py-6 text-center">
          <span className="text-lg opacity-50">📝</span>
          <p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">
            Nothing here yet — add a reminder above
          </p>
        </div>
      ) : (
        <div className="flex max-h-[280px] flex-col gap-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="group flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
              >
                <motion.button
                  onClick={() => toggleTodo(item.id)}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-full border transition-all',
                    item.completed
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-[var(--dw-color-border-default)] text-transparent hover:border-[var(--dw-color-brand-primary)]',
                  )}
                >
                  <Check className="size-2.5" strokeWidth={3} />
                </motion.button>
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-[11px] font-medium transition-colors',
                    item.completed
                      ? 'text-[var(--dw-color-ink-tertiary)] line-through'
                      : 'text-[var(--dw-color-ink-primary)]',
                  )}
                  title={item.text}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => deleteTodo(item.id)}
                  className="flex size-5 shrink-0 items-center justify-center rounded-md text-[var(--dw-color-ink-tertiary)] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title="Remove"
                >
                  <X className="size-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--dw-color-border-default)] py-1.5 text-[10px] font-semibold text-[var(--dw-color-ink-tertiary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="size-3" />
          Clear {completedCount} completed
        </button>
      )}
    </div>
  )
}
