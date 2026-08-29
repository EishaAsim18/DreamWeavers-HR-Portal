import { motion } from 'framer-motion'
import { Mail, MapPin, Pencil, Phone, Trash2 } from 'lucide-react'
import { SpotlightCard } from '@/shared/components/effects/spotlight'
import { cn } from '@/shared/lib/utils'
import {
  EMPLOYEE_ROLE_CONFIG,
  EMPLOYEE_STATUS_CONFIG,
  employeeFullName,
  employeeInitials,
  type Employee,
} from '../types/employee.types'

interface EmployeeCardProps {
  employee: Employee
  index: number
  canEdit: boolean
  canDelete: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

export function EmployeeCard({
  employee,
  index,
  canEdit,
  canDelete,
  onOpen,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const roleCfg = EMPLOYEE_ROLE_CONFIG[employee.role]
  const statusCfg = EMPLOYEE_STATUS_CONFIG[employee.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.5), type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
    >
      <SpotlightCard
        className="group relative h-full overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]"
        spotlightColor={`${roleCfg.accent}18`}
      >
        {/* Accent top strip */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${employee.avatarColor}, ${roleCfg.accent})`,
          }}
        />

        <div className="relative flex h-full flex-col p-4 pt-5">
          {/* Header: avatar + role */}
          <button type="button" onClick={onOpen} className="flex items-start gap-3 text-left">
            <div className="relative">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${employee.avatarColor}, ${employee.avatarColor}bb)`,
                }}
              >
                {employeeInitials(employee)}
              </div>
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-white',
                  statusCfg.dot,
                )}
                title={statusCfg.label}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-[var(--dw-color-ink-primary)] transition-colors group-hover:text-[var(--dw-color-brand-primary)]">
                {employeeFullName(employee)}
              </p>
              <p className="mt-0.5 truncate text-[11.5px] text-[var(--dw-color-ink-secondary)]">
                {employee.jobTitle}
              </p>
              <span
                className={cn(
                  'mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                  roleCfg.chip,
                )}
              >
                {roleCfg.icon} {roleCfg.label}
              </span>
            </div>
          </button>

          {/* Meta */}
          <div className="mt-3 space-y-1.5 border-t border-[var(--dw-color-border-default)]/60 pt-3 text-[11.5px] text-[var(--dw-color-ink-secondary)]">
            <p className="flex items-center gap-2 truncate">
              <Mail className="size-3.5 shrink-0 text-[var(--dw-color-ink-tertiary)]" />
              <span className="truncate">{employee.email}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-3.5 shrink-0 text-[var(--dw-color-ink-tertiary)]" />
              {employee.phone}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0 text-[var(--dw-color-ink-tertiary)]" />
              {employee.location} · {employee.department}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={onOpen}
              className="text-[11.5px] font-semibold text-[var(--dw-color-brand-primary)] transition-colors hover:text-[var(--dw-color-brand-primary-hover)]"
            >
              View profile →
            </button>
            {/* Always visible on touch devices; hover-reveal on desktop */}
            <div className="flex items-center gap-1 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              {canEdit && (
                <button
                  type="button"
                  aria-label="Edit"
                  onClick={onEdit}
                  className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-brand-primary-muted)] hover:text-[var(--dw-color-brand-primary)]"
                >
                  <Pencil className="size-3.5" />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={onDelete}
                  className="flex size-7 items-center justify-center rounded-lg text-[var(--dw-color-ink-tertiary)] transition-colors hover:bg-[var(--dw-color-danger-muted)] hover:text-[var(--dw-color-danger)]"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
