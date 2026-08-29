/**
 * Animated dot/grid background.
 * Inspired by Magic UI Animated Grid & Aceternity Grid/Dot backgrounds.
 */
import { cn } from '@/shared/lib/utils'

interface GridBackgroundProps {
  className?: string
  variant?: 'dots' | 'lines' | 'cross'
  color?: string
  size?: number
  fade?: boolean
}

export function GridBackground({
  className,
  variant = 'dots',
  color = 'var(--dw-color-brand-primary)',
  size = 24,
  fade = true,
}: GridBackgroundProps) {
  const dotSvg = `url("data:image/svg+xml,%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${size / 2}' cy='${size / 2}' r='1' fill='${encodeURIComponent(color)}' fill-opacity='0.35'/%3E%3C/svg%3E")`
  const linesSvg = `url("data:image/svg+xml,%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M ${size} 0 L 0 0 0 ${size}' fill='none' stroke='${encodeURIComponent(color)}' stroke-opacity='0.1' stroke-width='0.5'/%3E%3C/svg%3E")`
  const crossSvg = `url("data:image/svg+xml,%3Csvg width='${size * 2}' height='${size * 2}' viewBox='0 0 ${size * 2} ${size * 2}' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='${size}' cy='${size}' r='1.5' fill='${encodeURIComponent(color)}' fill-opacity='0.3'/%3E%3Ccircle cx='0' cy='0' r='0.8' fill='${encodeURIComponent(color)}' fill-opacity='0.15'/%3E%3Ccircle cx='${size * 2}' cy='0' r='0.8' fill='${encodeURIComponent(color)}' fill-opacity='0.15'/%3E%3Ccircle cx='0' cy='${size * 2}' r='0.8' fill='${encodeURIComponent(color)}' fill-opacity='0.15'/%3E%3C/svg%3E")`

  const bg = variant === 'dots' ? dotSvg : variant === 'lines' ? linesSvg : crossSvg

  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{ backgroundImage: bg }}
      aria-hidden="true"
    >
      {fade && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--dw-color-surface-canvas)]" />
      )}
    </div>
  )
}

/**
 * Pulsing grid — cells randomly light up.
 */
import { useEffect, useState } from 'react'

interface PulsingGridProps {
  cols?: number
  rows?: number
  className?: string
  color?: string
}

export function PulsingGrid({ cols = 12, rows = 6, className, color = '#4A7C92' }: PulsingGridProps) {
  const total = cols * rows
  const [active, setActive] = useState<Set<number>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      const count = 2 + Math.floor(Math.random() * 3)
      const next = new Set<number>()
      while (next.size < count) next.add(Math.floor(Math.random() * total))
      setActive(next)
    }, 800)
    return () => clearInterval(interval)
  }, [total])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-sm border border-transparent transition-all duration-700"
          style={{
            backgroundColor: active.has(i) ? `${color}22` : 'transparent',
            borderColor: active.has(i) ? `${color}33` : 'transparent',
          }}
        />
      ))}
    </div>
  )
}
