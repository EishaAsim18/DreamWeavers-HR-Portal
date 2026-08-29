import * as React from 'react'
import { cn } from '@/shared/lib/utils'

function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] px-1.5 font-mono text-[10px] font-medium text-[var(--dw-color-ink-tertiary)]',
        className,
      )}
      {...props}
    />
  )
}

export { Kbd }
