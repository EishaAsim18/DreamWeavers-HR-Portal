import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { ANIMATION } from '@/shared/constants'
import { SpotlightCard } from '@/shared/components/effects/spotlight'

interface AuthGlassCardProps {
  children: ReactNode
  className?: string
  title?: ReactNode
  description?: string
  headerAction?: ReactNode
}

export function AuthGlassCard({
  children,
  className,
  title,
  description,
  headerAction,
}: AuthGlassCardProps) {
  return (
    <motion.div
      className={cn('relative w-full max-w-[400px] min-w-0', className)}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: ANIMATION.slow, ease: [0.32, 0.72, 0, 1], delay: 0.08 }}
    >
      <SpotlightCard className="auth-glass-card w-full overflow-x-hidden rounded-2xl p-4 pb-5 min-[380px]:p-5 min-[380px]:pb-6 sm:p-8">
        {(title || description) && (
          <div className="mb-5 min-w-0 sm:mb-6">
            <div className="flex items-start justify-between gap-3">
              {title && (
                <h1 className="text-xl font-bold leading-tight tracking-tight text-[var(--dw-color-ink-primary)] sm:text-[1.35rem]">
                  {title}
                </h1>
              )}
              {headerAction && <div className="shrink-0 pt-0.5">{headerAction}</div>}
            </div>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="min-w-0">{children}</div>
      </SpotlightCard>
    </motion.div>
  )
}
