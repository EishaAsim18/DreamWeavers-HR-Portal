import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  EMPLOYEE_ROLE_CONFIG,
  EMPLOYEE_STATUS_CONFIG,
  employeeFullName,
  employeeInitials,
  type Employee,
} from '../types/employee.types'

interface EmployeeTableProps {
  employees: Employee[]
  canEdit: (e: Employee) => boolean
  canDelete: (e: Employee) => boolean
  onOpen: (e: Employee) => void
  onEdit: (e: Employee) => void
  onDelete: (e: Employee) => void
}

export function EmployeeTable({
  employees,
  canEdit,
  canDelete,
  onOpen,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)]/60">
              {['Member', 'Role', 'Department', 'Status', 'Joined', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e, i) => {
              const roleCfg = EMPLOYEE_ROLE_CONFIG[e.role]
              const statusCfg = EMPLOYEE_STATUS_CONFIG[e.status]
              return (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4) }}
                  className="group cursor-pointer border-b border-[var(--dw-color-border-default)]/50 transition-colors last:border-0 hover:bg-[var(--dw-color-brand-primary-subtle)]/60"
                  onClick={() => onOpen(e)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${e.avatarColor}, ${e.avatarColor}bb)`,
                        }}
                      >
                        {employeeInitials(e)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[var(--dw-color-ink-primary)]">
                          {employeeFullName(e)}
                        </p>
                        <p className="truncate text-[11px] text-[var(--dw-color-ink-tertiary)]">
                          {e.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold',
                        roleCfg.chip,
                      )}
                    >
                      {roleCfg.icon} {roleCfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--dw-color-ink-secondary)]">
                    {e.department}
                    <p className="text-[10.5px] text-[var(--dw-color-ink-tertiary)]">{e.jobTitle}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--dw-color-ink-secondary)]">
                      <span className={cn('size-2 rounded-full', statusCfg.dot)} />
                      {statusCfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] tabular-nums text-[var(--dw-color-ink-secondary)]">
                    {new Date(e.joinDate).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center justify-end gap-1 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      {canEdit(e) && (
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => onEdit(e)}
                          className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-brand-primary-muted)] hover:text-[var(--dw-color-brand-primary)]"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                      )}
                      {canDelete(e) && (
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => onDelete(e)}
                          className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-danger-muted)] hover:text-[var(--dw-color-danger)]"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
