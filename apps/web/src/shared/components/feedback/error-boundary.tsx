import { Component, type ErrorInfo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { PremiumCard } from '@/shared/components/premium/premium-card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PremiumCard className="max-w-md p-8 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-[var(--dw-color-danger-muted)]">
                <AlertCircle className="size-6 text-[var(--dw-color-danger)]" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--dw-color-ink-primary)]">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-[var(--dw-color-ink-secondary)]">
                An unexpected error occurred. Try again or contact support if the problem persists.
              </p>
              <Button className="mt-6" onClick={this.handleRetry}>
                Try again
              </Button>
            </PremiumCard>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
