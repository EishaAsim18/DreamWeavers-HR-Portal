import { LayoutGrid, List, RotateCcw, Search } from 'lucide-react'
import type { Role } from '@/shared/types'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import {
  DEPARTMENTS,
  EMPLOYEE_ROLE_CONFIG,
  EMPLOYEE_STATUS_CONFIG,
  type EmployeeFilters,
  type EmployeeStatus,
  type EmployeesViewMode,
} from '../types/employee.types'

interface EmployeesToolbarProps {
  filters: EmployeeFilters
  onFiltersChange: (updates: Partial<EmployeeFilters>) => void
  onReset: () => void
  activeFilterCount: number
  viewMode: EmployeesViewMode
  onViewModeChange: (mode: EmployeesViewMode) => void
  resultCount: number
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

const FILTER_ROLES: Role[] = ['super_admin', 'admin', 'employee']
const FILTER_STATUSES: EmployeeStatus[] = ['active', 'on_leave', 'inactive']

export function EmployeesToolbar({
  filters,
  onFiltersChange,
  onReset,
  activeFilterCount,
  viewMode,
  onViewModeChange,
  resultCount,
}: EmployeesToolbarProps) {
  return (
    <div className="mb-4 space-y-3 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]/80 p-3.5 shadow-[var(--dw-shadow-sm)] backdrop-blur-sm">
      {/* Row 1: search + view toggle */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[150px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" />
          <Input
            value={filters.query}
            onChange={(e) => onFiltersChange({ query: e.target.value })}
            placeholder="Search by name, email, title, department…"
            className="pl-10"
          />
        </div>

        <p className="hidden text-xs font-medium text-[var(--dw-color-ink-tertiary)] sm:block">
          {resultCount} result{resultCount === 1 ? '' : 's'}
        </p>

        <div className="flex items-center gap-1 rounded-xl border border-[var(--dw-color-border-default)] p-0.5">
          {(
            [
              { mode: 'grid', icon: LayoutGrid, label: 'Grid view' },
              { mode: 'table', icon: List, label: 'Table view' },
            ] as const
          ).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              type="button"
              aria-label={label}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                'flex size-8 items-center justify-center rounded-[10px] transition-colors',
                viewMode === mode
                  ? 'bg-[var(--dw-color-brand-primary)] text-white shadow-sm'
                  : 'text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]',
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 text-xs">
            <RotateCcw className="size-3.5" />
            Reset ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Row 2: chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">
          Role
        </span>
        {FILTER_ROLES.map((role) => {
          const cfg = EMPLOYEE_ROLE_CONFIG[role]
          const active = filters.roles.includes(role)
          return (
            <button
              key={role}
              type="button"
              onClick={() => onFiltersChange({ roles: toggleValue(filters.roles, role) })}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                active
                  ? cfg.chip + ' shadow-sm ring-1 ring-current/20'
                  : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]',
              )}
            >
              {cfg.icon} {cfg.label}
            </button>
          )
        })}

        <span className="ml-3 mr-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">
          Status
        </span>
        {FILTER_STATUSES.map((status) => {
          const cfg = EMPLOYEE_STATUS_CONFIG[status]
          const active = filters.statuses.includes(status)
          return (
            <button
              key={status}
              type="button"
              onClick={() =>
                onFiltersChange({ statuses: toggleValue(filters.statuses, status) })
              }
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                active
                  ? cfg.chip + ' shadow-sm ring-1 ring-current/20'
                  : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]',
              )}
            >
              <span className={cn('size-1.5 rounded-full', cfg.dot)} />
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Row 3: departments */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">
          Department
        </span>
        {DEPARTMENTS.map((dept) => {
          const active = filters.departments.includes(dept)
          return (
            <button
              key={dept}
              type="button"
              onClick={() =>
                onFiltersChange({ departments: toggleValue(filters.departments, dept) })
              }
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                active
                  ? 'border-[var(--dw-color-brand-primary)]/40 bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)] shadow-sm'
                  : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-tertiary)] hover:bg-[var(--dw-color-surface-sunken)]',
              )}
            >
              {dept}
            </button>
          )
        })}
      </div>
    </div>
  )
}
