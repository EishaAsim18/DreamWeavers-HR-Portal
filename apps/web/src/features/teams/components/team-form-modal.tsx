import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, Crown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { CALENDAR_PEOPLE, getPerson } from '@/features/calendar/data/calendar.mock'
import { TEAM_COLORS } from '../types/team.types'
import type { Team, TeamFormData } from '../types/team.types'

interface TeamFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingTeam: Team | null
  onCreate: (data: TeamFormData) => void
  onUpdate: (id: string, updates: Partial<Pick<TeamFormData, 'name' | 'description' | 'color'>>) => void
}

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
        'w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-2 text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/10',
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
        'w-full resize-none rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-2 text-sm text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/10',
        props.className,
      )}
    />
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

const EMPTY_FORM: TeamFormData = { name: '', description: '', color: TEAM_COLORS[0], managerId: '' }

export function TeamFormModal({ isOpen, onClose, editingTeam, onCreate, onUpdate }: TeamFormModalProps) {
  const isEditing = !!editingTeam
  const [form, setForm] = useState<TeamFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof TeamFormData, string>>>({})

  useEffect(() => {
    if (editingTeam) {
      setForm({
        name: editingTeam.name,
        description: editingTeam.description,
        color: editingTeam.color,
        managerId: editingTeam.managerId,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editingTeam, isOpen])

  const set = <K extends keyof TeamFormData>(key: K, value: TeamFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e })
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof TeamFormData, string>> = {}
    if (!form.name.trim()) e.name = 'Team name is required'
    if (!isEditing && !form.managerId) e.managerId = 'Choose a manager for this team'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (isEditing && editingTeam) {
      onUpdate(editingTeam.id, { name: form.name, description: form.description, color: form.color })
    } else {
      onCreate(form)
    }
  }

  const currentManager = editingTeam ? getPerson(editingTeam.managerId) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--dw-color-border-default)] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">
                  {isEditing ? 'Edit Team' : 'Create New Team'}
                </h2>
                <p className="text-xs text-[var(--dw-color-ink-tertiary)]">
                  {isEditing ? 'Update the team profile' : 'Name the team and pick a manager to get started'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-4 px-5 py-4">
                <div>
                  <FieldLabel required>Team Name</FieldLabel>
                  <FieldInput
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="e.g. Engineering, Growth, Support…"
                    autoFocus
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </div>

                <div>
                  <FieldLabel>Description</FieldLabel>
                  <FieldTextarea
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="What does this team own?"
                    rows={3}
                  />
                </div>

                <div>
                  <FieldLabel>Accent Color</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {TEAM_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => set('color', color)}
                        className={cn(
                          'flex size-8 items-center justify-center rounded-full border-2 transition-transform',
                          form.color === color ? 'scale-110 border-[var(--dw-color-ink-primary)]' : 'border-transparent',
                        )}
                        style={{ background: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {isEditing ? (
                  <div className="rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-2.5">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">
                      <Crown className="size-3.5 text-amber-500" /> Current Manager
                    </p>
                    <p className="text-xs text-[var(--dw-color-ink-tertiary)]">
                      {currentManager?.name ?? 'Unknown'} — reassign the manager from the team's roster panel.
                    </p>
                  </div>
                ) : (
                  <div>
                    <FieldLabel required>
                      <span className="flex items-center gap-1.5">
                        <Crown className="size-3.5" /> Manager
                      </span>
                    </FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {CALENDAR_PEOPLE.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => set('managerId', p.id)}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                            form.managerId === p.id
                              ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]'
                              : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)] hover:border-[#7c3aed]/30',
                          )}
                        >
                          <span
                            className="flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                            style={{ background: p.avatarColor }}
                          >
                            {p.initials}
                          </span>
                          {p.name.split(' ')[0]}
                          <span className="text-[9px] opacity-60">{p.id}</span>
                        </button>
                      ))}
                    </div>
                    {errors.managerId && <FieldError>{errors.managerId}</FieldError>}
                  </div>
                )}
              </div>

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
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isEditing ? 'Save Changes' : 'Create Team'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
