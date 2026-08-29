import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Lock, ShieldCheck, UserRound } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { employeeSchema, type EmployeeFormValues } from '../schemas/employee.schema'
import {
  DEPARTMENTS,
  type AssignableRole,
  type Employee,
  type EmployeeFormData,
} from '../types/employee.types'

interface EmployeeFormModalProps {
  open: boolean
  onClose: () => void
  editingEmployee: Employee | null
  assignableRoles: AssignableRole[]
  isSaving: boolean
  onSubmit: (data: EmployeeFormData) => void
}

const FIELD_LABEL = 'text-[12px] font-semibold text-[var(--dw-color-ink-primary)]'
const SELECT_CLASS =
  'h-9 w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 text-sm text-[var(--dw-color-ink-primary)] outline-none transition-colors focus:border-[var(--dw-color-brand-primary)] focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]/20'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-[11px] text-[var(--dw-color-danger)]" role="alert">
      {message}
    </p>
  )
}

export function EmployeeFormModal({
  open,
  onClose,
  editingEmployee,
  assignableRoles,
  isSaving,
  onSubmit,
}: EmployeeFormModalProps) {
  const isEdit = Boolean(editingEmployee)
  const canAssignHR = assignableRoles.includes('admin')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'employee',
      department: 'Engineering',
      jobTitle: '',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      location: '',
    },
  })

  const selectedRole = watch('role')

  useEffect(() => {
    if (!open) return
    if (editingEmployee) {
      reset({
        firstName: editingEmployee.firstName,
        lastName: editingEmployee.lastName,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        role: editingEmployee.role === 'admin' ? 'admin' : 'employee',
        department: editingEmployee.department,
        jobTitle: editingEmployee.jobTitle,
        status: editingEmployee.status,
        joinDate: editingEmployee.joinDate,
        location: editingEmployee.location,
      })
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'employee',
        department: 'Engineering',
        jobTitle: '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        location: '',
      })
    }
  }, [open, editingEmployee, reset])

  const roleOptions: {
    role: AssignableRole
    label: string
    sub: string
    icon: typeof UserRound
    locked: boolean
  }[] = [
    {
      role: 'employee',
      label: 'Employee',
      sub: 'Standard team member',
      icon: UserRound,
      locked: false,
    },
    {
      role: 'admin',
      label: 'HR',
      sub: canAssignHR ? 'Manages people & operations' : 'Super Admin only',
      icon: ShieldCheck,
      locked: !canAssignHR,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-4rem)] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit member' : 'Add team member'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update this person’s profile and role.'
              : 'Create a new account in the DreamWeavers directory.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => void handleSubmit((values) => onSubmit(values))(e)}
          className="space-y-4"
          noValidate
        >
          {/* Role selector */}
          <div className="space-y-1.5">
            <p className={FIELD_LABEL}>Role</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {roleOptions.map(({ role, label, sub, icon: Icon, locked }) => {
                const active = selectedRole === role
                return (
                  <button
                    key={role}
                    type="button"
                    disabled={locked}
                    onClick={() => setValue('role', role, { shouldValidate: true })}
                    className={cn(
                      'relative rounded-xl border p-3 text-left transition-all',
                      locked && 'cursor-not-allowed opacity-55',
                      active
                        ? role === 'admin'
                          ? 'border-violet-400 bg-violet-50 shadow-sm'
                          : 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-subtle)] shadow-sm'
                        : 'border-[var(--dw-color-border-default)] hover:bg-[var(--dw-color-surface-sunken)]',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon
                        className={cn(
                          'size-4',
                          active
                            ? role === 'admin'
                              ? 'text-violet-600'
                              : 'text-[var(--dw-color-brand-primary)]'
                            : 'text-[var(--dw-color-ink-tertiary)]',
                        )}
                      />
                      <span className="text-[13px] font-semibold text-[var(--dw-color-ink-primary)]">
                        {label}
                      </span>
                      {locked && <Lock className="ml-auto size-3.5 text-[var(--dw-color-ink-tertiary)]" />}
                    </span>
                    <span className="mt-1 block text-[11px] text-[var(--dw-color-ink-tertiary)]">
                      {sub}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="flex items-center gap-1.5 rounded-lg bg-[var(--dw-color-surface-sunken)] px-2.5 py-1.5 text-[10.5px] text-[var(--dw-color-ink-tertiary)]">
              <Lock className="size-3 shrink-0" />
              Super Admin accounts can never be created from the app — they exist only via system seed.
            </p>
            <FieldError message={errors.role?.message} />
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-first">First name</label>
              <Input id="emp-first" placeholder="Ayesha" {...register('firstName')} />
              <FieldError message={errors.firstName?.message} />
            </div>
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-last">Last name</label>
              <Input id="emp-last" placeholder="Khan" {...register('lastName')} />
              <FieldError message={errors.lastName?.message} />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-email">Email</label>
              <Input id="emp-email" type="email" placeholder="name@dreamweavers.com" {...register('email')} />
              <FieldError message={errors.email?.message} />
            </div>
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-phone">Phone</label>
              <Input id="emp-phone" placeholder="+92 300 0000000" {...register('phone')} />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          {/* Work */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-dept">Department</label>
              <select id="emp-dept" className={SELECT_CLASS} {...register('department')}>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <FieldError message={errors.department?.message} />
            </div>
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-title">Job title</label>
              <Input id="emp-title" placeholder="Product Designer" {...register('jobTitle')} />
              <FieldError message={errors.jobTitle?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-status">Status</label>
              <select id="emp-status" className={SELECT_CLASS} {...register('status')}>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-join">Join date</label>
              <Input id="emp-join" type="date" {...register('joinDate')} />
              <FieldError message={errors.joinDate?.message} />
            </div>
            <div className="space-y-1.5">
              <label className={FIELD_LABEL} htmlFor="emp-location">Location</label>
              <Input id="emp-location" placeholder="Karachi" {...register('location')} />
              <FieldError message={errors.location?.message} />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--dw-color-border-default)]/60 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {isEdit ? 'Save changes' : selectedRole === 'admin' ? 'Create HR account' : 'Add member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
