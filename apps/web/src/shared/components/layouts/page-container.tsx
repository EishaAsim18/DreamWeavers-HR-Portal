import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export interface PageContainerProps {
  children: ReactNode
  className?: string
  constrained?: boolean
}

export function PageContainer({ children, className, constrained = true }: PageContainerProps) {
  return (
    <div
      className={cn(
        'w-full min-w-0 px-4 py-4 sm:px-5 sm:py-6 md:px-7',
        constrained && 'mx-auto max-w-[var(--dw-page-max-width)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <motion.div
      className={cn(
        'mb-5 flex min-w-0 flex-col gap-3 sm:mb-7 sm:flex-row sm:items-start sm:justify-between sm:gap-4',
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="min-w-0 space-y-1.5">
        {/* Gradient heading */}
        <h1 className="break-words bg-gradient-to-r from-[var(--dw-color-ink-primary)] via-[var(--dw-color-ink-primary)] to-[var(--dw-color-brand-primary)] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-[1.75rem] md:text-[2rem]">
          {title}
        </h1>
        {description && (
          <p className="text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
