import { motion } from 'framer-motion'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { SPRING } from '@/shared/lib/motion'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-[var(--dw-duration-normal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dw-color-brand-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--dw-color-brand-primary)] text-[var(--dw-color-brand-on-primary)] shadow-[var(--dw-shadow-xs)] hover:bg-[var(--dw-color-brand-primary-hover)] hover:shadow-[var(--dw-shadow-sm)]',
        secondary:
          'border border-[var(--dw-color-border-default)] bg-transparent text-[var(--dw-color-ink-primary)] hover:bg-[var(--dw-color-surface-sunken)]',
        ghost:
          'bg-transparent text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)] hover:text-[var(--dw-color-ink-primary)]',
        danger: 'bg-[var(--dw-color-danger)] text-white hover:opacity-90',
        'danger-outline':
          'border border-[var(--dw-color-danger)]/30 bg-transparent text-[var(--dw-color-danger)] hover:bg-[var(--dw-color-danger-muted)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-sm',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      )
    }

    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      ...buttonProps
    } = props

    void onDrag
    void onDragStart
    void onDragEnd
    void onAnimationStart
    void onAnimationEnd

    return (
      <motion.button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        whileTap={disabled || loading ? undefined : { scale: 0.97, transition: SPRING.button }}
        whileHover={
          disabled || loading || variant === 'ghost'
            ? undefined
            : { y: -1, transition: SPRING.gentle }
        }
        {...buttonProps}
      >
        {loading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
