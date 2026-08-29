import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Plus, Search, X, LayoutGrid } from 'lucide-react'
import { ROUTES } from '@/shared/constants'

interface TeamsToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  teamCount: number
  unassignedCount: number
  canManageTeams: boolean
  onNewTeam: () => void
}

export function TeamsToolbar({
  search,
  onSearchChange,
  teamCount,
  unassignedCount,
  canManageTeams,
  onNewTeam,
}: TeamsToolbarProps) {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-4 py-2.5 shadow-[var(--dw-shadow-sm)]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Search */}
      <div className="relative flex min-w-[160px] flex-1 items-center sm:max-w-[280px]">
        <Search className="pointer-events-none absolute left-2.5 size-3.5 text-[var(--dw-color-ink-tertiary)]" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search teams or people…"
          className="w-full rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] py-1.5 pl-8 pr-7 text-xs text-[var(--dw-color-ink-primary)] placeholder:text-[var(--dw-color-ink-tertiary)] transition-colors focus:border-[var(--dw-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/10"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 flex size-4 items-center justify-center rounded-full text-[var(--dw-color-ink-tertiary)] hover:text-red-500"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      <div className="hidden md:block md:flex-1" />

      <span className="flex items-center gap-1.5 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-3 py-1.5 text-xs font-medium text-[var(--dw-color-ink-secondary)]">
        <LayoutGrid className="size-3.5 text-[#7c3aed]" />
        {teamCount} {teamCount === 1 ? 'team' : 'teams'}
      </span>

      {unassignedCount > 0 && (
        <span className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <Users className="size-3.5" />
          {unassignedCount} unassigned
        </span>
      )}

      {/* Link to Employees — keeps modules aligned */}
      <Link
        to={ROUTES.employees}
        className="flex items-center gap-1.5 rounded-xl border border-[var(--dw-color-border-default)] px-3 py-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] transition-all hover:border-[var(--dw-color-brand-primary)]/40 hover:text-[var(--dw-color-brand-primary)]"
      >
        <Users className="size-3.5" />
        <span className="hidden sm:block">Directory</span>
      </Link>

      {canManageTeams && (
        <motion.button
          onClick={onNewTeam}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="size-3.5" />
          <span>New Team</span>
        </motion.button>
      )}
    </motion.div>
  )
}
