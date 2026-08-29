import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, Mail, Shield, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthGlassCard } from '@/features/auth/components/auth-glass-card'
import { PasswordInput } from '@/features/auth/components/password-input'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema'
import { useAuth } from '@/shared/hooks/use-auth'
import { ROUTES } from '@/shared/constants'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

// ── Brand SVG icons ───────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

// ── Demo role configs ──────────────────────────────────────────────────────────
const DEMO_ROLES = [
  {
    icon: Crown,
    label: 'Super Admin',
    sub: 'Full access',
    userId: 'usr_super_1',
    ringColor: 'ring-[var(--dw-color-brand-primary)]/40',
    bgActive: 'bg-[var(--dw-color-brand-primary-muted)] border-[var(--dw-color-brand-primary)]/40',
    bgDefault: 'border-[var(--dw-color-border-default)] hover:bg-[var(--dw-color-brand-primary-muted)] hover:border-[var(--dw-color-brand-primary)]/30',
    labelColor: 'text-[var(--dw-color-brand-primary)]',
    iconColor: 'text-[var(--dw-color-brand-primary)]',
    iconBg: 'bg-[var(--dw-color-brand-primary-muted)]',
    defaultActive: true,
  },
  {
    icon: Shield,
    label: 'HR',
    sub: 'People & management',
    userId: 'usr_admin_1',
    ringColor: '',
    bgActive: '',
    bgDefault: 'border-[var(--dw-color-border-default)] hover:bg-[var(--dw-color-surface-sunken)]',
    labelColor: 'text-[var(--dw-color-ink-primary)]',
    iconColor: 'text-[var(--dw-color-ink-secondary)]',
    iconBg: 'bg-[var(--dw-color-surface-sunken)]',
    defaultActive: false,
  },
  {
    icon: User,
    label: 'Employee',
    sub: 'Own data only',
    userId: 'usr_emp_1',
    ringColor: '',
    bgActive: '',
    bgDefault: 'border-[var(--dw-color-border-default)] hover:bg-[var(--dw-color-surface-sunken)]',
    labelColor: 'text-[var(--dw-color-ink-primary)]',
    iconColor: 'text-[var(--dw-color-ink-secondary)]',
    iconBg: 'bg-[var(--dw-color-surface-sunken)]',
    defaultActive: false,
  },
]

export function LoginPage() {
  const { login, isAuthenticated, devLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.dashboard

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch {
      toast.error('Invalid email or password')
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} sign-in coming soon!`)
  }

  return (
    <AuthGlassCard
      title={<>Welcome back <span aria-hidden="true">👋</span></>}
      description="Sign in to your DreamWeavers workspace"
    >
      {/* ── Credentials form ─────────────────────────────────── */}
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4" noValidate>
        {/* Email */}
        <motion.div
          className="space-y-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <label
            htmlFor="email"
            className="text-[13px] font-medium text-[var(--dw-color-ink-primary)]"
          >
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[13px] font-medium text-[var(--dw-color-ink-primary)]"
            >
              Password
            </label>
            <Link
              to={ROUTES.forgotPassword}
              className="text-xs font-medium text-[var(--dw-color-brand-primary)] transition-colors hover:text-[var(--dw-color-brand-primary-hover)]"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
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
            {/* Animated shimmer overlay */}
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
                Signing in…
              </span>
            ) : (
              <>
                Sign in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* ── Social login ─────────────────────────────────────── */}
      <motion.div
        className="mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.27 }}
      >
        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-1 border-t border-[var(--dw-color-border-default)]/60" />
          <span className="mx-3 text-[11px] font-medium text-[var(--dw-color-ink-tertiary)]">
            or continue with
          </span>
          <div className="flex-1 border-t border-[var(--dw-color-border-default)]/60" />
        </div>

        {/* Social buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { id: 'google', Icon: GoogleIcon, label: 'Google' },
            { id: 'apple',  Icon: AppleIcon,  label: 'Apple' },
          ].map(({ id, Icon, label }) => (
            <motion.button
              key={id}
              type="button"
              onClick={() => handleSocialLogin(label)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-2.5 text-xs font-medium text-[var(--dw-color-ink-primary)] shadow-[var(--dw-shadow-xs)] transition-all hover:bg-[var(--dw-color-surface-sunken)] hover:shadow-[var(--dw-shadow-sm)]"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <Icon />
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Demo accounts ────────────────────────────────────── */}
      <motion.div
        className="mt-5 space-y-3 border-t border-[var(--dw-color-border-default)]/50 pt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
      >
        <p className="text-center text-[11px] font-medium text-[var(--dw-color-ink-tertiary)]">
          Sign in as a demo account
        </p>

        <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
          {DEMO_ROLES.map(({ icon: Icon, label, sub, userId, bgDefault, bgActive, labelColor, iconColor, iconBg, defaultActive }) => (
            <motion.button
              key={userId}
              type="button"
              className={cn(
                'rounded-xl border bg-[var(--dw-color-surface-base)] px-3 py-2.5 text-left shadow-[var(--dw-shadow-xs)] transition-all',
                defaultActive ? bgActive : bgDefault,
              )}
              onClick={() =>
                void devLogin(userId).then(() => navigate(from, { replace: true }))
              }
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
            >
              <div className={cn('mb-1.5 flex size-6 items-center justify-center rounded-lg', iconBg)}>
                <Icon className={cn('size-3.5', iconColor)} />
              </div>
              <p className={cn('text-[11px] font-semibold leading-tight', labelColor)}>{label}</p>
              <p className="mt-0.5 text-[9.5px] leading-tight text-[var(--dw-color-ink-tertiary)]">{sub}</p>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-[10px] text-[var(--dw-color-ink-tertiary)]">
          Or sign in manually — password is{' '}
          <code className="rounded bg-[var(--dw-color-surface-sunken)] px-1.5 py-0.5 font-mono text-[9px]">
            password123
          </code>
        </p>
      </motion.div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <motion.p
        className="mt-5 text-center text-[11px] text-[var(--dw-color-ink-tertiary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.38 }}
      >
        New to DreamWeavers?{' '}
        <Link
          to={ROUTES.signup}
          className="font-medium text-[var(--dw-color-brand-primary)] transition-colors hover:text-[var(--dw-color-brand-primary-hover)]"
        >
          Create an account.
        </Link>
      </motion.p>
    </AuthGlassCard>
  )
}
