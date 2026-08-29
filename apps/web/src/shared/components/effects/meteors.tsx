/**
 * Meteors — diagonal shooting-star lines.
 * Inspired by Aceternity UI / Magic UI Meteors.
 */
import { cn } from '@/shared/lib/utils'
import { useMemo } from 'react'

interface MeteorsProps {
  number?: number
  className?: string
}

export function Meteors({ number = 18, className }: MeteorsProps) {
  const meteors = useMemo(() =>
    Array.from({ length: number }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 5}s`,
      size: 1 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.5,
    })),
  [number])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor absolute"
          style={{
            top: m.top,
            left: m.left,
            width: `${80 + Math.random() * 120}px`,
            height: `${m.size}px`,
            opacity: m.opacity,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </div>
  )
}
