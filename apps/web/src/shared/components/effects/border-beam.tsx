/**
 * Border Beam — an animated glowing line that travels around a card border.
 * Inspired by Magic UI Border Beam.
 */
import { cn } from '@/shared/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  borderWidth?: number
}

export function BorderBeam({
  className,
  size = 200,
  duration = 12,
  delay = 0,
  colorFrom = 'var(--dw-color-brand-primary)',
  colorTo = '#7ab5cc',
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        className,
      )}
      aria-hidden="true"
      style={
        {
          '--size': size,
          '--duration': `${duration}s`,
          '--delay': `-${delay}s`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--border-width': `${borderWidth}px`,
        } as React.CSSProperties
      }
    >
      <div className="border-beam-inner absolute inset-0 rounded-[inherit]" />
    </div>
  )
}

/**
 * Glowing border wrapper — adds a subtle animated glow on card hover.
 * Inspired by Cursor website's card glowing effect.
 */
interface GlowingCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  active?: boolean
}

export function GlowingCard({
  children,
  className,
  glowColor = 'rgba(74,124,146,0.35)',
  active = false,
}: GlowingCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-[inherit] transition-all duration-300',
        className,
      )}
    >
      {/* Glow layer */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100',
          active && 'opacity-100',
        )}
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 60%)` }}
        aria-hidden="true"
      />
      {/* Border gradient */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          active && 'opacity-100',
        )}
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent 50%, ${glowColor}) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          border: '1px solid transparent',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
