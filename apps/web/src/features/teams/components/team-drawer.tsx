import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Crown,
  Trash2,
  UserPlus,
  UserMinus,
  BadgeCheck,
  ListChecks,
  CheckCircle2,
  Pencil,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { CALENDAR_PEOPLE, getPerson } from '@/features/calendar/data/calendar.mock'
import type { Team } from '../types/team.types'
import { MANAGER_ROLE_LABEL } from '../types/team.types'
import { getWorkloadByEmployee } from '../lib/workload'
import type { useTeamPermissions } from '../hooks/use-team-permissions'
import type { useTeamsStore } from '../hooks/use-teams-store'

type Perms = ReturnType<typeof useTeamPermissions>
type Store = ReturnType<typeof useTeamsStore>

interface TeamDrawerProps {
  team: Team | null
  isOpen: boolean
  onClose: () => void
  perms: Perms
  store: Store
}

function Avatar({ employeeId, size = 'md' }: { employeeId: string; size?: 'sm' | 'md' | 'lg' }) {
  const person = getPerson(employeeId)
  if (!person) return null
  const dims = size === 'lg' ? 'size-10' : size === 'md' ? 'size-8' : 'size-6'
  const text = size === 'lg' ? 'text-sm' : size === 'md' ? 'text-xs' : 'text-[10px]'
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', dims, text)}
      style={{ background: person.avatarColor }}
      title={person.name}
    >
      {person.initials}
    </span>
  )
}

function WorkloadBadge({ employeeId }: { employeeId: string }) {
  const workload = getWorkloadByEmployee()[employeeId]
  if (!workload || workload.total === 0) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[var(--dw-color-surface-sunken)] px-2 py-0.5 text-[10px] font-medium text-[var(--dw-color-ink-tertiary)]">
        <ListChecks className="size-3" /> No tasks
      </span>
    )
  }
  return (
    <span className="flex items-center gap-2 text-[10px] font-medium text-[var(--dw-color-ink-tertiary)]">
      <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">
        <ListChecks className="size-3" /> {workload.active} active
      </span>
      {workload.completed > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">
          <CheckCircle2 className="size-3" /> {workload.completed} done
        </span>
      )}
    </span>
  )
}

function MemberRow({
  employeeId,
  role,
  isManager,
  canManage,
  onMakeManager,
  onRemove,
  onRoleChange,
}: {
  employeeId: string
  role: string
  isManager: boolean
  canManage: boolean
  onMakeManager: () => void
  onRemove: () => void
  onRoleChange: (role: string) => void
}) {
  const person = getPerson(employeeId)
  const [roleDraft, setRoleDraft] = useState(role)
  const [confirmRemove, setConfirmRemove] = useState(false)
  if (!person) return null

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-2.5">
      <Avatar employeeId={employeeId} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-xs font-semibold text-[var(--dw-color-ink-primary)]">
          {person.name}
          {isManager && <Crown className="size-3 shrink-0 text-amber-500" />}
        </p>
        <p className="truncate text-[10px] text-[var(--dw-color-ink-tertiary)]">
          {person.id} · {person.department}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {canManage && !isManager ? (
            <input
              value={roleDraft}
              onChange={(e) => setRoleDraft(e.target.value)}
              onBlur={() => { if (roleDraft.trim() && roleDraft !== role) onRoleChange(roleDraft) }}
              className="w-28 rounded-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--dw-color-ink-secondary)] focus:border-[#7c3aed] focus:outline-none"
              placeholder="Role in team"
            />
          ) : (
            <span className="rounded-full bg-[var(--dw-color-surface-sunken)] px-2 py-0.5 text-[10px] font-semibold text-[var(--dw-color-ink-secondary)]">
              {isManager ? MANAGER_ROLE_LABEL : role}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <WorkloadBadge employeeId={employeeId} />
        {canManage && (
          <div className="flex items-center gap-1">
            {!isManager && (
              <button
                onClick={onMakeManager}
                title="Make manager"
                className="flex size-6 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-amber-50 hover:text-amber-600"
              >
                <BadgeCheck className="size-3.5" />
              </button>
            )}
            {!isManager && (
              <button
                onClick={() => {
                  if (confirmRemove) { onRemove(); setConfirmRemove(false) }
                  else { setConfirmRemove(true); setTimeout(() => setConfirmRemove(false), 3000) }
                }}
                title="Remove from team"
                className={cn(
                  'flex h-6 items-center gap-1 rounded-lg px-1.5 text-[10px] font-semibold',
                  confirmRemove ? 'bg-red-500 text-white' : 'text-[var(--dw-color-ink-tertiary)] hover:bg-red-50 hover:text-red-500',
                )}
              >
                <UserMinus className="size-3.5" />
                {confirmRemove && <span>Confirm?</span>}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AddMemberPanel({ team, store }: { team: Team; store: Store }) {
  const [isOpen, setIsOpen] = useState(false)
  const [employeeId, setEmployeeId] = useState('')
  const [role, setRole] = useState('')

  const available = CALENDAR_PEOPLE.filter((p) => !team.members.some((m) => m.employeeId === p.id))

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={available.length === 0}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--dw-color-border-default)] py-2.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] transition-colors hover:border-[#7c3aed]/40 hover:text-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <UserPlus className="size-3.5" />
        {available.length === 0 ? 'Everyone is already on this team' : 'Add Member'}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] p-3">
      <p className="text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Add a team member</p>
      <div className="flex flex-wrap gap-1.5">
        {available.map((p) => (
          <button
            key={p.id}
            onClick={() => { setEmployeeId(p.id); setRole((prev) => prev || p.jobTitle) }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-all',
              employeeId === p.id
                ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]'
                : 'border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] text-[var(--dw-color-ink-secondary)] hover:border-[#7c3aed]/30',
            )}
          >
            <Avatar employeeId={p.id} size="sm" />
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>
      {employeeId && (
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role within the team"
          className="rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-2.5 py-1.5 text-xs text-[var(--dw-color-ink-primary)] focus:border-[#7c3aed] focus:outline-none"
        />
      )}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => { setIsOpen(false); setEmployeeId(''); setRole('') }}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-base)]"
        >
          Cancel
        </button>
        <button
          disabled={!employeeId}
          onClick={() => {
            store.addMember(team.id, { employeeId, role: role || 'Member' })
            setIsOpen(false)
            setEmployeeId('')
            setRole('')
          }}
          className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
        >
          Add to team
        </button>
      </div>
    </div>
  )
}

export function TeamDrawer({ team, isOpen, onClose, perms, store }: TeamDrawerProps) {
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && team && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="border-b border-[var(--dw-color-border-default)] px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span
                    className="mb-2 inline-block h-1.5 w-8 rounded-full"
                    style={{ background: team.color }}
                  />
                  <h2 className="text-base font-bold text-[var(--dw-color-ink-primary)]">{team.name}</h2>
                  <p className="mt-0.5 text-xs text-[var(--dw-color-ink-tertiary)]">{team.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {perms.canEditTeam(team) && (
                    <button
                      onClick={() => store.openEditForm(team)}
                      title="Edit team"
                      className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-[#7c3aed]"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                  {perms.canDeleteTeam(team) && (
                    <button
                      onClick={() => {
                        if (confirmDeleteTeam) store.deleteTeam(team.id)
                        else { setConfirmDeleteTeam(true); setTimeout(() => setConfirmDeleteTeam(false), 3000) }
                      }}
                      title="Delete team"
                      className={cn(
                        'flex h-7 items-center gap-1 rounded-lg px-1.5 text-[10px] font-semibold',
                        confirmDeleteTeam ? 'bg-red-500 text-white' : 'text-[var(--dw-color-ink-tertiary)] hover:bg-red-50 hover:text-red-500',
                      )}
                    >
                      <Trash2 className="size-3.5" />
                      {confirmDeleteTeam && <span>Confirm?</span>}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-[var(--dw-color-ink-tertiary)]">
                <span>{team.members.length} members</span>
                <span>·</span>
                <span>Created {new Date(team.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
                Roster
              </p>
              <div className="flex flex-col gap-2">
                {team.members.map((m) => (
                  <MemberRow
                    key={m.employeeId}
                    employeeId={m.employeeId}
                    role={m.role}
                    isManager={team.managerId === m.employeeId}
                    canManage={perms.canManageTeams}
                    onMakeManager={() => store.changeManager(team.id, m.employeeId)}
                    onRemove={() => store.removeMember(team.id, m.employeeId)}
                    onRoleChange={(role) => store.updateMemberRole(team.id, m.employeeId, role)}
                  />
                ))}
              </div>

              {perms.canManageTeams && (
                <div className="mt-3">
                  <AddMemberPanel team={team} store={store} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
