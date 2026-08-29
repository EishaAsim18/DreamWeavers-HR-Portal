/**
 * Spotlight — radial gradient that follows the mouse.
 * Inspired by Aceternity UI Card Spotlight.
 */
import { useRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  size?: number
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(74,124,146,0.12)',
  size = 350,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -999, y: -999, opacity: 0 })

  return (
    <div
      ref={containerRef}
      className={cn('group relative overflow-hidden', className)}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 })
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, opacity: 0 }))}
    >
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 80%)`,
          opacity: pos.opacity,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/**
 * Spotlight SVG — decorative angled spotlight beam for hero sections.
 * Inspired by Aceternity.
 */
export function Spotlight({
  className,
  fill = 'rgba(74,124,146,0.18)',
}: {
  className?: string
  fill?: string
}) {
  return (
    <svg
      className={cn('pointer-events-none absolute animate-spotlight', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      aria-hidden="true"
    >
      <g filter="url(#spotlight-filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter id="spotlight-filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="151" />
        </filter>
      </defs>
    </svg>
  )
}
