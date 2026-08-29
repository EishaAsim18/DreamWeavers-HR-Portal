import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { AttendanceRecord } from '../types/attendance.types'
import { formatTime } from '../types/attendance.types'

interface ClockWidgetProps {
  record: AttendanceRecord | null
  clockedIn: boolean
  isPunching: boolean
  canSubmit: boolean
  onClockIn: () => void
  onClockOut: () => void
}

export function ClockWidget({
  record,
  clockedIn,
  isPunching,
  canSubmit,
  onClockIn,
  onClockOut,
}: ClockWidgetProps) {
  const [elapsed, setElapsed] = useState('00:00:00')

  useEffect(() => {
    if (!clockedIn || !record?.clockIn) {
      setElapsed('00:00:00')
      return
    }

    const start = new Date(record.clockIn).getTime()

    function tick() {
      const diff = Date.now() - start
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1000)
      setElapsed(
        [h, m, s].map((n) => String(n).padStart(2, '0')).join(':'),
      )
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [clockedIn, record?.clockIn])

  return (
    <div className="rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-6 shadow-[var(--dw-shadow-sm)]">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
          {new Date().toLocaleDateString('en-PK', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <motion.p
          key={elapsed}
          className="mt-3 font-mono text-4xl font-bold tracking-wider text-[var(--dw-color-ink-primary)] sm:text-5xl"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
        >
          {clockedIn ? elapsed : new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </motion.p>

        <div className="mt-4 flex justify-center gap-6 text-sm text-[var(--dw-color-ink-secondary)]">
          <div>
            <span className="text-[var(--dw-color-ink-tertiary)]">Clock In </span>
            <span className="font-medium">{formatTime(record?.clockIn ?? null)}</span>
          </div>
          <div>
            <span className="text-[var(--dw-color-ink-tertiary)]">Clock Out </span>
            <span className="font-medium">{formatTime(record?.clockOut ?? null)}</span>
          </div>
        </div>
      </div>

      {canSubmit && (
        <div className="mt-6 flex justify-center gap-3">
          {!clockedIn ? (
            <Button
              size="lg"
              className="min-w-[160px] gap-2"
              onClick={onClockIn}
              disabled={isPunching}
            >
              {isPunching ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
              Clock In
            </Button>
          ) : (
            <Button
              size="lg"
              variant="danger"
              className="min-w-[160px] gap-2"
              onClick={onClockOut}
              disabled={isPunching}
            >
              {isPunching ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              Clock Out
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
