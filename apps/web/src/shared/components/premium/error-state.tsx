import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { EmptyState } from '@/shared/components/premium/empty-state'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  action?: React.ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this content. Try again in a moment.",
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      className={className}
      action={
        action ??
        (onRetry ? (
          <Button onClick={onRetry}>Try again</Button>
        ) : undefined)
      }
    />
  )
}
