/**
 * BackgroundBeams — animated SVG lines emanating from a focal point.
 * Inspired by Aceternity Background Beams.
 */
import { cn } from '@/shared/lib/utils'

interface BackgroundBeamsProps {
  className?: string
  color?: string
}

export function BackgroundBeams({ className, color = '#4A7C92' }: BackgroundBeamsProps) {
  const beams = [
    { x1: '50%', y1: '0%', x2: '0%',   y2: '100%', delay: '0s'    },
    { x1: '50%', y1: '0%', x2: '15%',  y2: '100%', delay: '0.4s'  },
    { x1: '50%', y1: '0%', x2: '30%',  y2: '100%', delay: '0.8s'  },
    { x1: '50%', y1: '0%', x2: '50%',  y2: '100%', delay: '1.2s'  },
    { x1: '50%', y1: '0%', x2: '70%',  y2: '100%', delay: '1.6s'  },
    { x1: '50%', y1: '0%', x2: '85%',  y2: '100%', delay: '2.0s'  },
    { x1: '50%', y1: '0%', x2: '100%', y2: '100%', delay: '2.4s'  },
  ]

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {beams.map((_, i) => (
          <linearGradient key={i} id={`beam-grad-${i}`} x1={beams[i].x1} y1={beams[i].y1} x2={beams[i].x2} y2={beams[i].y2} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={color} stopOpacity="0" />
            <stop offset="35%"  stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        ))}
        <filter id="beam-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      {beams.map((b, i) => (
        <line
          key={i}
          x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
          stroke={`url(#beam-grad-${i})`}
          strokeWidth="1"
          filter="url(#beam-blur)"
          className="beam-line"
          style={{ animationDelay: b.delay }}
        />
      ))}
    </svg>
  )
}

/**
 * BackgroundLines — wavy SVG paths as background accents.
 * As seen on height.app (via Aceternity).
 */
export function BackgroundLines({ className, color = '#4A7C92' }: { className?: string; color?: string }) {
  const lines = [
    'M -100 200 Q 200 100 500 250 T 1100 200',
    'M -100 350 Q 300 200 600 380 T 1100 320',
    'M -100 500 Q 200 350 500 520 T 1100 460',
    'M -100 100 Q 400 50  700 150 T 1100 80',
  ]

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {lines.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeOpacity={0.06 - i * 0.01}
          strokeWidth="1.5"
          className="bg-line"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </svg>
  )
}
