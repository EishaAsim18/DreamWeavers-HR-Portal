/**
 * TextShimmer — moving light-sweep shimmer over text.
 * Inspired by Magic UI / Motion Primitives.
 */
import { cn } from '@/shared/lib/utils'

interface TextShimmerProps {
  children: string
  className?: string
  duration?: number
  spread?: number
}

export function TextShimmer({
  children,
  className,
  duration = 2.5,
  spread = 2,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        'relative inline-block bg-clip-text text-transparent',
        'text-shimmer',
        className,
      )}
      style={
        {
          '--shimmer-duration': `${duration}s`,
          '--shimmer-spread': spread,
          backgroundImage:
            'linear-gradient(90deg, var(--dw-color-ink-primary) 0%, var(--dw-color-brand-primary) 40%, #7ab5cc 50%, var(--dw-color-brand-primary) 60%, var(--dw-color-ink-primary) 100%)',
          backgroundSize: `${spread * 100}% 100%`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  )
}

/**
 * EncryptedText — reveals text character by character with a scramble effect.
 * Inspired by Aceternity Encrypted Text.
 */
import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

interface EncryptedTextProps {
  text: string
  className?: string
  speed?: number
  /** Trigger animation when true */
  animate?: boolean
}

export function EncryptedText({ text, className, speed = 40, animate = true }: EncryptedTextProps) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const iterRef = useRef(0)

  useEffect(() => {
    if (!animate) { setDisplay(text); return }
    iterRef.current = 0

    const step = () => {
      setDisplay(
        text.split('').map((char, i) => {
          if (i < iterRef.current) return char
          if (char === ' ') return ' '
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join(''),
      )
      if (iterRef.current < text.length) {
        iterRef.current += 0.4
        frameRef.current = setTimeout(step, speed)
      } else {
        setDisplay(text)
      }
    }
    step()
    return () => { if (frameRef.current) clearTimeout(frameRef.current) }
  }, [text, animate, speed])

  return <span className={cn('font-mono', className)}>{display}</span>
}
