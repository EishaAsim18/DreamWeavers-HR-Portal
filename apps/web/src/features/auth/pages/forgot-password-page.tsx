import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { mockForgotPassword } from '@/features/auth/api/auth.api'
import { AuthGlassCard } from '@/features/auth/components/auth-glass-card'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/auth.schema'
import { useAuth } from '@/shared/hooks/use-auth'
import { ROUTES } from '@/shared/constants'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { ANIMATION } from '@/shared/constants'

export function ForgotPasswordPage() {
  const { isAuthenticated } = useAuth()
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await mockForgotPassword(values.email)
      setSentEmail(values.email)
      setSent(true)
      toast.success('Reset link sent')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <AuthGlassCard>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: ANIMATION.normal }}
          >
            <Link
              to={ROUTES.login}
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--dw-color-ink-secondary)] transition-colors hover:text-[var(--dw-color-brand-primary)]"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>

            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--dw-color-ink-primary)]">
                Reset password
              </h1>
              <p className="text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" />
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={cn('pl-10', errors.email && 'border-[var(--dw-color-danger)]')}
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-[var(--dw-color-danger)]" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                Send reset link
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="py-4 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: ANIMATION.slow, ease: [0.32, 0.72, 0, 1] }}
          >
            <motion.div
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[var(--dw-color-success-muted)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.1 }}
            >
              <CheckCircle2 className="size-8 text-[var(--dw-color-success)]" />
            </motion.div>

            <h1 className="text-2xl font-semibold text-[var(--dw-color-ink-primary)]">
              Check your inbox
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">
              We sent a password reset link to{' '}
              <span className="font-medium text-[var(--dw-color-ink-primary)]">{sentEmail}</span>
            </p>
            <p className="mt-2 text-xs text-[var(--dw-color-ink-tertiary)]">
              Mock flow — no email is actually sent in this demo.
            </p>

            <Button variant="secondary" className="mt-8 w-full" asChild>
              <Link to={ROUTES.login}>Return to sign in</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthGlassCard>
  )
}
