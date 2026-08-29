import { CalendarCheck, Clock, Timer, UserX } from 'lucide-react'
import type { AttendanceStats } from '../types/attendance.types'
import { formatWorkMinutes } from '../types/attendance.types'

interface AttendanceStatCardsProps {
  stats: AttendanceStats | null
}

const cards = [
  { key: 'present' as const, label: 'Present', icon: CalendarCheck, color: 'text-emerald-600' },
  { key: 'late' as const, label: 'Late', icon: Clock, color: 'text-amber-600' },
  { key: 'absent' as const, label: 'Absent', icon: UserX, color: 'text-red-600' },
  { key: 'avgWorkMinutes' as const, label: 'Avg Hours', icon: Timer, color: 'text-[var(--dw-color-brand-primary)]' },
]

export function AttendanceStatCards({ stats }: AttendanceStatCardsProps) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-4 shadow-[var(--dw-shadow-sm)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--dw-color-ink-tertiary)]">{label}</p>
            <Icon className={`size-4 ${color}`} />
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--dw-color-ink-primary)]">
            {stats
              ? key === 'avgWorkMinutes'
                ? formatWorkMinutes(stats.avgWorkMinutes)
                : stats[key]
              : '—'}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--dw-color-ink-tertiary)]">This month</p>
        </div>
      ))}
    </div>
  )
}
