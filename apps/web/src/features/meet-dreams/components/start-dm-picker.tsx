import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, MessageSquarePlus } from 'lucide-react'
import { getAllPeople } from '@/features/calendar/data/calendar.mock'
import { useCall } from '../contexts/call-context'

interface StartDmPickerProps {
  isOpen: boolean
  currentUserId?: string
  onClose: () => void
  onSelect: (userId: string) => void
}

export function StartDmPicker({ isOpen, currentUserId, onClose, onSelect }: StartDmPickerProps) {
  const [query, setQuery] = useState('')
  const { onlineUserIds } = useCall()

  const people = getAllPeople().filter(
    (p) => p.id !== currentUserId && p.name.toLowerCase().includes(query.toLowerCase()),
  )

  const handleClose = () => {
    setQuery('')
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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] px-5 py-4">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="size-4 text-[#4a7c92]" />
                <h2 className="text-sm font-bold text-[var(--dw-color-ink-primary)]">New Message</h2>
              </div>
              <button onClick={handleClose} className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]">
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search people…"
                  className="w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] py-2 pl-8 pr-3 text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] focus:border-[#4a7c92] focus:outline-none"
                />
              </div>
              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {people.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onSelect(p.id); setQuery('') }}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
                  >
                    <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: p.avatarColor }}>
                      {p.initials}
                      {onlineUserIds.has(p.id) && (
                        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[var(--dw-color-surface-base)] bg-emerald-500" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[var(--dw-color-ink-primary)]">{p.name}</p>
                      <p className="truncate text-[11px] text-[var(--dw-color-ink-tertiary)]">
                        {onlineUserIds.has(p.id) ? <span className="text-emerald-600">Online</span> : p.jobTitle}
                      </p>
                    </div>
                  </button>
                ))}
                {people.length === 0 && (
                  <p className="px-2 py-3 text-center text-xs text-[var(--dw-color-ink-tertiary)]">No matches.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
