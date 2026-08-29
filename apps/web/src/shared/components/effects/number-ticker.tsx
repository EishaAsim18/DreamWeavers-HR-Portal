/**
 * NumberTicker — rolls digits up like an odometer.
 * Inspired by Magic UI Number Ticker.
 */
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface NumberTickerProps {
  value: number
  direction?: 'up' | 'down'
  delay?: number
  className?: string
  decimalPlaces?: number
  prefix?: string
  suffix?: string
}

export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(direction === 'down' ? value : 0)
  const spring = useSpring(motionVal, { damping: 60, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => {
      motionVal.set(direction === 'down' ? 0 : value)
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [isInView, motionVal, value, direction, delay])

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent =
          prefix +
          Intl.NumberFormat('en-US', { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(Number(v.toFixed(decimalPlaces))) +
          suffix
      }
    })
    return unsubscribe
  }, [spring, prefix, suffix, decimalPlaces])

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums tracking-tight', className)}
    >
      {prefix}0{suffix}
    </span>
  )
}
