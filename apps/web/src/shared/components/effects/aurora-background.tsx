/**
 * Aurora Background — animated multi-color gradient blobs.
 * Inspired by Magic UI / Aceternity Aurora.
 * Drop as absolute fill inside any container.
 */
import { cn } from '@/shared/lib/utils'

interface AuroraBackgroundProps {
  className?: string
  /** Hue base in degrees (0-360). Defaults to brand teal ~190 */
  hue?: number
  intensity?: 'subtle' | 'medium' | 'strong'
}

export function AuroraBackground({
  className,
  hue = 190,
  intensity = 'medium',
}: AuroraBackgroundProps) {
  const opacities = { subtle: '0.25', medium: '0.45', strong: '0.65' }
  const op = opacities[intensity]

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {/* Blob 1 — slow drift top-left */}
      <div
        className="aurora-blob absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, hsl(${hue} 55% 60% / ${op}), transparent 70%)`,
          animation: 'aurora-drift-1 18s ease-in-out infinite',
        }}
      />
      {/* Blob 2 — medium drift top-right */}
      <div
        className="aurora-blob absolute -right-1/4 -top-1/3 h-[60%] w-[60%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, hsl(${(hue + 30) % 360} 50% 55% / ${op}), transparent 70%)`,
          animation: 'aurora-drift-2 22s ease-in-out infinite',
        }}
      />
      {/* Blob 3 — bottom center slow */}
      <div
        className="aurora-blob absolute -bottom-1/4 left-1/4 h-[55%] w-[55%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, hsl(${(hue - 20 + 360) % 360} 60% 65% / ${op}), transparent 70%)`,
          animation: 'aurora-drift-3 26s ease-in-out infinite',
        }}
      />
    </div>
  )
}

/** Aurora text — animated gradient text shimmer */
interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
}

export function AuroraText({
  children,
  className,
  colors = ['#4A7C92', '#7ab5cc', '#2d6a7f', '#6ea8be', '#4A7C92'],
}: AuroraTextProps) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="sr-only">{children}</span>
      <span
        className="aurora-text relative bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})`,
          backgroundSize: '300% auto',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}
