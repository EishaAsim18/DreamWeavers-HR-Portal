import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/shared/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]',
        success: 'bg-[var(--dw-color-success-muted)] text-[var(--dw-color-success)]',
        warning: 'bg-[var(--dw-color-warning-muted)] text-[var(--dw-color-warning)]',
        danger: 'bg-[var(--dw-color-danger-muted)] text-[var(--dw-color-danger)]',
        muted: 'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
