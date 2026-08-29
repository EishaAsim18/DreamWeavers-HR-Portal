import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-1 text-sm text-[var(--dw-color-ink-primary)] shadow-[var(--dw-shadow-xs)] transition-all duration-[var(--dw-duration-normal)] placeholder:text-[var(--dw-color-ink-tertiary)] hover:border-[var(--dw-color-border-strong)] input-premium disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
