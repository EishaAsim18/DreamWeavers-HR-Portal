import { FileEdit } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { AttendanceRecord } from '../types/attendance.types'
import {
  ATTENDANCE_STATUS_CLASS,
  ATTENDANCE_STATUS_LABELS,
  formatDate,
  formatTime,
  formatWorkMinutes,
} from '../types/attendance.types'

interface AttendanceHistoryTableProps {
  records: AttendanceRecord[]
  showEmployee?: boolean
  canRequestCorrection?: boolean
  onRequestCorrection?: (record: AttendanceRecord) => void
}

export function AttendanceHistoryTable({
  records,
  showEmployee = false,
  canRequestCorrection = false,
  onRequestCorrection,
}: AttendanceHistoryTableProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--dw-color-border-default)] p-8 text-center text-sm text-[var(--dw-color-ink-tertiary)]">
        No attendance records found.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--dw-color-ink-tertiary)]">Date</th>
              {showEmployee && (
                <th className="px-4 py-3 text-left font-medium text-[var(--dw-color-ink-tertiary)]">Employee</th>
              )}
              <th className="px-4 py-3 text-left font-medium text-[var(--dw-color-ink-tertiary)]">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--dw-color-ink-tertiary)]">Clock In</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--dw-color-ink-tertiary)]">Clock Out</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--dw-color-ink-tertiary)]">Hours</th>
              {canRequestCorrection && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-[var(--dw-color-border-default)] last:border-0 hover:bg-[var(--dw-color-surface-sunken)]/50"
              >
                <td className="px-4 py-3 font-medium text-[var(--dw-color-ink-primary)]">
                  {formatDate(record.date)}
                </td>
                {showEmployee && (
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[var(--dw-color-ink-primary)]">{record.userName}</p>
                      <p className="text-xs text-[var(--dw-color-ink-tertiary)]">{record.department}</p>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ATTENDANCE_STATUS_CLASS[record.status]}`}
                  >
                    {ATTENDANCE_STATUS_LABELS[record.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--dw-color-ink-secondary)]">
                  {formatTime(record.clockIn)}
                </td>
                <td className="px-4 py-3 text-[var(--dw-color-ink-secondary)]">
                  {formatTime(record.clockOut)}
                </td>
                <td className="px-4 py-3 text-[var(--dw-color-ink-secondary)]">
                  {formatWorkMinutes(record.workMinutes)}
                </td>
                {canRequestCorrection && (
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => onRequestCorrection?.(record)}
                    >
                      <FileEdit className="size-3.5" />
                      Correct
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
