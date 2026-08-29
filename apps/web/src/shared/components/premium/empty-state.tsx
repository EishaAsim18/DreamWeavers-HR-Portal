import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  overline?: string
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  overline,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="relative mb-6">
        <motion.div
          className="absolute inset-0 scale-150 rounded-full bg-[var(--dw-color-brand-primary)]/10 blur-2xl"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative flex size-14 items-center justify-center rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-sm)]">
          <Icon className="size-6 text-[var(--dw-color-ink-tertiary)]" strokeWidth={1.5} />
        </div>
      </div>
      {overline && (
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--dw-color-ink-tertiary)]">
          {overline}
        </p>
      )}
      <h3 className="text-lg font-semibold text-[var(--dw-color-ink-primary)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
