import { useState } from 'react'
import {
  Briefcase,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react'
import {
  Drawer,
  DrawerDescription,
  DrawerSheetContent,
  DrawerTitle,
} from '@/shared/components/ui/drawer'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import {
  EMPLOYEE_ROLE_CONFIG,
  EMPLOYEE_STATUS_CONFIG,
  employeeFullName,
  employeeInitials,
  type Employee,
} from '../types/employee.types'

interface EmployeeDrawerProps {
  employee: Employee | null
  open: boolean
  onClose: () => void
  canEdit: boolean
  canDelete: boolean
  onEdit: () => void
  onDelete: () => void
}

export function EmployeeDrawer({
  employee,
  open,
  onClose,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: EmployeeDrawerProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (!employee) return null

  const roleCfg = EMPLOYEE_ROLE_CONFIG[employee.role]
  const statusCfg = EMPLOYEE_STATUS_CONFIG[employee.status]

  const details = [
    { icon: Mail, label: 'Email', value: employee.email },
    { icon: Phone, label: 'Phone', value: employee.phone },
    { icon: Building2, label: 'Department', value: employee.department },
    { icon: Briefcase, label: 'Job title', value: employee.jobTitle },
    {
      icon: CalendarDays,
      label: 'Joined',
      value: new Date(employee.joinDate).toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
    { icon: MapPin, label: 'Location', value: employee.location },
  ]

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setConfirmingDelete(false)
          onClose()
        }
      }}
      direction="right"
    >
      <DrawerSheetContent>
        {/* Gradient header */}
        <div
          className="relative shrink-0 overflow-hidden px-5 pb-5 pt-6"
          style={{
            background: `linear-gradient(135deg, ${employee.avatarColor}22, ${roleCfg.accent}18)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full blur-3xl"
            style={{ background: `${roleCfg.accent}30` }}
          />
          <div className="relative flex items-start gap-4">
            <div className="relative">
              <div
                className="flex size-16 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${employee.avatarColor}, ${employee.avatarColor}bb)`,
                }}
              >
                {employeeInitials(employee)}
              </div>
              <span
                className={cn(
                  'absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white',
                  statusCfg.dot,
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <DrawerTitle className="truncate text-[17px]">
                {employeeFullName(employee)}
              </DrawerTitle>
              <DrawerDescription className="mt-0.5 truncate text-[12.5px]">
                {employee.jobTitle} · {employee.department}
              </DrawerDescription>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold',
                    roleCfg.chip,
                  )}
                >
                  {roleCfg.icon} {roleCfg.label}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold',
                    statusCfg.chip,
                  )}
                >
                  <span className={cn('size-1.5 rounded-full', statusCfg.dot)} />
                  {statusCfg.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--dw-color-ink-tertiary)]">
            Details
          </p>
          <div className="space-y-1">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--dw-color-brand-primary-muted)]">
                  <Icon className="size-4 text-[var(--dw-color-brand-primary)]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10.5px] text-[var(--dw-color-ink-tertiary)]">{label}</p>
                  <p className="truncate text-[13px] font-medium text-[var(--dw-color-ink-primary)]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {employee.role === 'super_admin' && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-rose-700">
              👑 This is the Super Admin account. It cannot be edited or removed from the
              application.
            </p>
          )}
          {employee.role === 'admin' && !canEdit && (
            <p className="mt-4 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-violet-700">
              🛡️ HR accounts can only be managed by the Super Admin.
            </p>
          )}
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && (
          <div className="shrink-0 border-t border-[var(--dw-color-border-default)] p-4">
            {confirmingDelete ? (
              <div className="space-y-2.5">
                <p className="text-[12.5px] font-medium text-[var(--dw-color-ink-primary)]">
                  Remove {employeeFullName(employee)} from the directory?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1"
                    onClick={onDelete}
                  >
                    Yes, remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {canEdit && (
                  <Button variant="secondary" size="sm" className="flex-1 gap-1.5" onClick={onEdit}>
                    <Pencil className="size-3.5" />
                    Edit profile
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="danger-outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DrawerSheetContent>
    </Drawer>
  )
}
