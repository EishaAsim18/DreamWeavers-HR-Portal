import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Users, ListChecks, Trash2, Pencil } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import type { Team } from '../types/team.types'
import { getWorkloadByEmployee } from '../lib/workload'

interface TeamCardProps {
  team: Team
  index: number
  canDelete: boolean
  canEdit: boolean
  isBusy: boolean
  onOpen: (team: Team) => void
  onEdit: (team: Team) => void
  onDelete: (team: Team) => void
}

function MemberAvatar({ employeeId, size = 'sm' }: { employeeId: string; size?: 'sm' | 'md' }) {
  const person = getPerson(employeeId)
  if (!person) return null
  const dims = size === 'md' ? 'size-8 text-xs' : 'size-6 text-[10px]'
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--dw-color-surface-base)] font-bold text-white', dims)}
      style={{ background: person.avatarColor }}
      title={person.name}
    >
      {person.initials}
    </span>
  )
}

export function TeamCard({ team, index, canDelete, canEdit, isBusy, onOpen, onEdit, onDelete }: TeamCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const manager = getPerson(team.managerId)
  const workload = getWorkloadByEmployee()
  const activeTaskCount = team.members.reduce((sum, m) => sum + (workload[m.employeeId]?.active ?? 0), 0)

  const otherMembers = team.members.filter((m) => m.employeeId !== team.managerId)
  const visibleAvatars = otherMembers.slice(0, 4)
  const overflow = otherMembers.length - visibleAvatars.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-4 shadow-[var(--dw-shadow-xs)] transition-shadow hover:shadow-[0_10px_28px_rgba(15,23,42,0.09)]"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: team.color }} />

      <div className="flex items-start justify-between gap-2">
        <button onClick={() => onOpen(team)} className="flex-1 text-left">
          <h3 className="text-sm font-bold text-[var(--dw-color-ink-primary)] transition-colors group-hover:text-[var(--dw-color-brand-primary)]">
            {team.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-[var(--dw-color-ink-tertiary)]">
            {team.description || 'No description yet.'}
          </p>
        </button>

        {(canEdit || canDelete) && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {canEdit && (
              <button
                onClick={() => onEdit(team)}
                className="flex size-6 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-brand-primary)]"
                title="Edit team"
              >
                <Pencil className="size-3.5" />
              </button>
            )}
            {canDelete && (
              <button
                disabled={isBusy}
                onClick={() => {
                  if (confirmingDelete) {
                    onDelete(team)
                    setConfirmingDelete(false)
                  } else {
                    setConfirmingDelete(true)
                    setTimeout(() => setConfirmingDelete(false), 3000)
                  }
                }}
                className={cn(
                  'flex h-6 items-center justify-center gap-1 rounded-lg px-1.5 text-[10px] font-semibold transition-colors',
                  confirmingDelete
                    ? 'bg-red-500 text-white'
                    : 'text-[var(--dw-color-ink-tertiary)] hover:bg-red-50 hover:text-red-500',
                )}
                title="Delete team"
              >
                <Trash2 className="size-3.5" />
                {confirmingDelete && <span>Confirm?</span>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Manager */}
      {manager && (
        <button
          onClick={() => onOpen(team)}
          className="flex items-center gap-2 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-2.5 py-2 text-left transition-colors hover:border-[var(--dw-color-brand-primary)]/30"
        >
          <MemberAvatar employeeId={manager.id} size="md" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-xs font-semibold text-[var(--dw-color-ink-primary)]">
              <Crown className="size-3 shrink-0 text-amber-500" />
              {manager.name}
            </p>
            <p className="truncate text-[10px] text-[var(--dw-color-ink-tertiary)]">{manager.jobTitle} · {manager.id}</p>
          </div>
        </button>
      )}

      {/* Roster preview + stats */}
      <button onClick={() => onOpen(team)} className="flex items-center justify-between text-left">
        <div className="flex items-center">
          {visibleAvatars.map((m) => (
            <span key={m.employeeId} className="-ml-1.5 first:ml-0">
              <MemberAvatar employeeId={m.employeeId} />
            </span>
          ))}
          {overflow > 0 && (
            <span className="-ml-1.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--dw-color-surface-base)] bg-[var(--dw-color-surface-sunken)] text-[9px] font-bold text-[var(--dw-color-ink-tertiary)]">
              +{overflow}
            </span>
          )}
          {otherMembers.length === 0 && (
            <span className="text-[11px] text-[var(--dw-color-ink-tertiary)]">No other members yet</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-[var(--dw-color-ink-tertiary)]">
          <span className="flex items-center gap-1">
            <Users className="size-3" /> {team.members.length}
          </span>
          <span className="flex items-center gap-1">
            <ListChecks className="size-3" /> {activeTaskCount}
          </span>
        </div>
      </button>
    </motion.div>
  )
}
