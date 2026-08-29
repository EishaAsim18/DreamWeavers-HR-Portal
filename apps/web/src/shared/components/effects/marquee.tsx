/**
 * Marquee — infinite horizontal / vertical scrolling ticker.
 * Inspired by Magic UI Marquee.
 */
import { cn } from '@/shared/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  /** px per second */
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
}

export function Marquee({
  children,
  className,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  repeat = 4,
}: MarqueeProps) {
  const duration = `${100 / (speed / 40)}s`

  return (
    <div
      className={cn(
        'group flex overflow-hidden [--gap:1rem]',
        className,
      )}
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 items-center justify-around gap-[var(--gap)]',
            direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
          style={{ animationDuration: duration }}
          aria-hidden={i > 0}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
