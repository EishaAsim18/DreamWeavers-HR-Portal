import { Check, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { AttendanceCorrection } from '../types/attendance.types'
import { formatDate } from '../types/attendance.types'

interface CorrectionsPanelProps {
  corrections: AttendanceCorrection[]
  canManage: boolean
  onReview: (id: string, decision: 'approved' | 'rejected') => void
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
}

export function CorrectionsPanel({ corrections, canManage, onReview }: CorrectionsPanelProps) {
  if (corrections.length === 0) return null

  return (
    <div className="rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-5">
      <h3 className="mb-4 text-sm font-semibold text-[var(--dw-color-ink-primary)]">
        Correction Requests
      </h3>
      <div className="space-y-3">
        {corrections.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-3 rounded-xl border border-[var(--dw-color-border-default)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--dw-color-ink-primary)]">
                  {c.requesterName}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_CLASS[c.status] ?? ''}`}
                >
                  {c.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">
                {formatDate(c.recordDate)} · {c.reason}
              </p>
            </div>

            {canManage && c.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1 text-emerald-600"
                  onClick={() => onReview(c.id, 'approved')}
                >
                  <Check className="size-3.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1 text-red-600"
                  onClick={() => onReview(c.id, 'rejected')}
                >
                  <X className="size-3.5" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
