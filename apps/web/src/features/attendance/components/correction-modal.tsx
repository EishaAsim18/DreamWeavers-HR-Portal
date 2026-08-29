import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import type { AttendanceRecord, CorrectionFormData } from '../types/attendance.types'
import { formatDate } from '../types/attendance.types'
import { correctionSchema, type CorrectionSchema } from '../schemas/attendance.schema'

interface CorrectionModalProps {
  open: boolean
  record: AttendanceRecord | null
  onClose: () => void
  onSubmit: (data: CorrectionFormData) => void
}

export function CorrectionModal({ open, record, onClose, onSubmit }: CorrectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CorrectionSchema>({
    resolver: zodResolver(correctionSchema),
    defaultValues: { reason: '' },
  })

  function handleClose() {
    reset()
    onClose()
  }

  function onFormSubmit(data: CorrectionSchema) {
    if (!record) return
    onSubmit({
      ...data,
      attendanceRecordId: record.id,
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Attendance Correction</DialogTitle>
          <DialogDescription>
            {record ? `For ${formatDate(record.date)}` : 'Select a record to correct.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium text-[var(--dw-color-ink-primary)]">Reason</label>
            <textarea
              id="reason"
              rows={3}
              className="w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--dw-color-brand-primary)]"
              placeholder="Explain why this correction is needed..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-[var(--dw-color-danger)]">{errors.reason.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="requestedClockIn" className="text-sm font-medium text-[var(--dw-color-ink-primary)]">Correct Clock In</label>
              <input
                id="requestedClockIn"
                type="datetime-local"
                className="w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-2 text-sm"
                {...register('requestedClockIn')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="requestedClockOut" className="text-sm font-medium text-[var(--dw-color-ink-primary)]">Correct Clock Out</label>
              <input
                id="requestedClockOut"
                type="datetime-local"
                className="w-full rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-2 text-sm"
                {...register('requestedClockOut')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !record}>
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
