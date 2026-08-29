import * as React from 'react'
import { cn } from '@/shared/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-md skeleton-shimmer', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export { Skeleton }
