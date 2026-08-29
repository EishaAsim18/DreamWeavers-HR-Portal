/**
 * MovingBorder — a gradient that travels along the perimeter.
 * Inspired by Aceternity Moving Border.
 */
import React, { useRef } from 'react'
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface MovingBorderProps {
  children?: React.ReactNode
  duration?: number
  rx?: string
  ry?: string
  style?: React.CSSProperties
  className?: string
}

function MovingBorderPath({ duration = 3000, rx, ry, ...rest }: MovingBorderProps) {
  const pathRef = useRef<SVGRectElement | null>(null)
  const progress = useMotionValue<number>(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (!length) return
    const pxPerMs = length / duration
    progress.set(pxPerMs * (time % duration))
  })

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x ?? 0)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y ?? 0)
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute h-full w-full" width="100%" height="100%">
        <rect fill="none" width="100%" height="100%" rx={rx ?? '12'} ry={ry ?? '12'} ref={pathRef} />
      </svg>
      <motion.div
        style={{ position: 'absolute', top: 0, left: 0, display: 'inline-block', transform, ...rest.style }}
        className={rest.className}
      />
    </>
  )
}

interface MovingBorderButtonProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  borderClassName?: string
  duration?: number
  as?: React.ElementType
}

export function MovingBorderButton({
  children,
  className,
  containerClassName,
  borderClassName,
  duration = 3000,
  as: Component = 'button',
}: MovingBorderButtonProps) {
  const inner = (
    <>
      <div className="absolute inset-0">
        <MovingBorderPath
          duration={duration}
          rx="12"
          ry="12"
          style={{ background: 'radial-gradient(circle, #4A7C92 0%, #7ab5cc 40%, transparent 60%)' }}
          className={cn('size-12 opacity-[0.7]', borderClassName)}
        />
      </div>
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center rounded-xl bg-[var(--dw-color-surface-base)] px-4 py-2 text-[var(--dw-color-ink-primary)] antialiased',
          className,
        )}
      >
        {children}
      </div>
    </>
  )

  return React.createElement(
    Component as string,
    {
      className: cn(
        'relative inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-transparent bg-transparent p-[1px] text-sm font-medium',
        containerClassName,
      ),
    },
    inner,
  )
}
