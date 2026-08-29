import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Hash, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { getAllPeople } from '@/features/calendar/data/calendar.mock'
import type { ChannelFormData } from '../types/chat.types'

interface NewChannelModalProps {
  isOpen: boolean
  currentUserId?: string
  onClose: () => void
  onCreate: (data: ChannelFormData) => Promise<void>
}

const EMPTY: ChannelFormData = { name: '', description: '', memberIds: [] }

export function NewChannelModal({ isOpen, currentUserId, onClose, onCreate }: NewChannelModalProps) {
  const [form, setForm] = useState<ChannelFormData>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleMember = (id: string) => {
    setForm((f) => ({
      ...f,
      memberIds: f.memberIds.includes(id) ? f.memberIds.filter((m) => m !== id) : [...f.memberIds, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Give the channel a name.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      await onCreate(form)
      setForm(EMPTY)
    } catch {
      setError('Something went wrong — try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setForm(EMPTY)
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Hash className="size-4 text-[#4a7c92]" />
                <h2 className="text-sm font-bold text-[var(--dw-color-ink-primary)]">New Channel</h2>
              </div>
              <button onClick={handleClose} className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 px-5 py-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    <AlertCircle className="size-3.5 shrink-0" /> {error}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Channel name</label>
                  <div className="flex items-center gap-1.5 rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-2">
                    <span className="text-sm text-[var(--dw-color-ink-tertiary)]">#</span>
                    <input
                      autoFocus
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. marketing"
                      className="flex-1 bg-transparent text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="What's this channel about?"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-2 text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] focus:border-[#4a7c92] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Add members</label>
                  <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg border border-[var(--dw-color-border-default)] p-1.5">
                    {getAllPeople().filter((p) => p.id !== currentUserId).map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleMember(p.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors',
                          form.memberIds.includes(p.id) ? 'bg-[var(--dw-color-brand-primary-muted)]' : 'hover:bg-[var(--dw-color-surface-sunken)]',
                        )}
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: p.avatarColor }}>
                          {p.initials}
                        </span>
                        <span className="flex-1 truncate font-medium text-[var(--dw-color-ink-primary)]">{p.name}</span>
                        {form.memberIds.includes(p.id) && <span className="text-[#4a7c92]">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[var(--dw-color-border-default)] px-5 py-4">
                <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2 text-xs font-semibold text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-gradient-to-br from-[#4a7c92] to-[#3d6779] px-4 py-2 text-xs font-semibold text-white shadow-[var(--dw-shadow-brand)] disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating…' : 'Create Channel'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
