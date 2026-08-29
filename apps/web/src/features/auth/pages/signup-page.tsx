import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, User as UserIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthGlassCard } from '@/features/auth/components/auth-glass-card'
import { PasswordInput } from '@/features/auth/components/password-input'
import { signupSchema, type SignupFormValues } from '@/features/auth/schemas/auth.schema'
import { useAuth } from '@/shared/hooks/use-auth'
import { ROUTES } from '@/shared/constants'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

export function SignupPage() {
  const { register: registerAccount, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  })

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await registerAccount(values)
      toast.success(`Welcome to DreamWeavers, ${values.firstName}! 🎉`)
      navigate(ROUTES.dashboard, { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create your account')
    }
  }

  return (
    <AuthGlassCard
      title={<>Join DreamWeavers <span aria-hidden="true">✨</span></>}
      description="Create an account to access your HR workspace, attendance, tasks, documents, and reports."
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4" noValidate>
        {/* First / last name */}
        <motion.div
          className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-[13px] font-medium text-[var(--dw-color-ink-primary)]">
              First name
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" />
              <Input
                id="firstName"
                autoComplete="given-name"
                placeholder="Ayesha"
                className={cn('pl-10', errors.firstName && 'border-[var(--dw-color-danger)]')}
                aria-invalid={Boolean(errors.firstName)}
                {...register('firstName')}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-[var(--dw-color-danger)]" role="alert">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-[13px] font-medium text-[var(--dw-color-ink-primary)]">
              Last name
            </label>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="Siddiqui"
              className={cn(errors.lastName && 'border-[var(--dw-color-danger)]')}
              aria-invalid={Boolean(errors.lastName)}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-xs text-[var(--dw-color-danger)]" role="alert">{errors.lastName.message}</p>
            )}
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          className="space-y-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <label htmlFor="email" className="text-[13px] font-medium text-[var(--dw-color-ink-primary)]">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--dw-color-ink-tertiary)]" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={cn('pl-10', errors.email && 'border-[var(--dw-color-danger)]')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-xs text-[var(--dw-color-danger)]" role="alert">
              {errors.email.message}
            </p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div
          className="space-y-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <label htmlFor="password" className="text-[13px] font-medium text-[var(--dw-color-ink-primary)]">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
        </motion.div>

        {/* Confirm password */}
        <motion.div
          className="space-y-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.21 }}
        >
          <label htmlFor="confirmPassword" className="text-[13px] font-medium text-[var(--dw-color-ink-primary)]">
            Confirm password
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-[var(--dw-shadow-brand)] transition-all hover:shadow-[0_6px_24px_rgba(74,124,146,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isSubmitting
                ? 'var(--dw-color-brand-primary)'
                : 'linear-gradient(135deg, #3d6779 0%, #4a7c92 50%, #6bafcc 100%)',
            }}
          >
            {!isSubmitting && (
              <motion.span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['−100%', '200%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
              />
            )}
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating your account…
              </span>
            ) : (
              <>
                Create account
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.p
        className="mt-5 text-center text-[11px] text-[var(--dw-color-ink-tertiary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Already have an account?{' '}
        <Link
          to={ROUTES.login}
          className="font-medium text-[var(--dw-color-brand-primary)] transition-colors hover:text-[var(--dw-color-brand-primary-hover)]"
        >
          Sign in instead.
        </Link>
      </motion.p>
    </AuthGlassCard>
  )
}
