import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/shared/components/layouts'
import { StaggerContainer, StaggerItem } from '@/shared/components/motion'
import {
  AnimatedAreaChart,
  BentoWidget,
  KanbanPreview,
  PremiumCard,
  StatCard,
} from '@/shared/components/premium'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/shared/hooks/use-auth'
import { ROUTES } from '@/shared/constants'
import { ROLE_LABELS, ROLE_BADGE_CLASS } from '@/shared/constants'
import { formatRelativeTime } from '@/shared/lib/utils'
import { Meteors } from '@/shared/components/effects/meteors'
import { TextShimmer } from '@/shared/components/effects/text-shimmer'
import { PulsingGrid } from '@/shared/components/effects/animated-grid'
import { BorderBeam } from '@/shared/components/effects/border-beam'
import { MagneticButton } from '@/shared/components/effects/magnetic-button'

const DashboardParticles3D = lazy(() =>
  import('@/shared/components/three/dashboard-particles-3d').then((m) => ({
    default: m.DashboardParticles3D,
  })),
)

const CHART_DATA = [
  { label: 'Mon', value: 82 },
  { label: 'Tue', value: 88 },
  { label: 'Wed', value: 91 },
  { label: 'Thu', value: 87 },
  { label: 'Fri', value: 94 },
  { label: 'Sat', value: 45 },
  { label: 'Sun', value: 38 },
]

const APPROVALS = [
  { id: '1', name: 'Bilal Ahmed', type: 'Leave request', time: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', name: 'Sana Malik', type: 'Attendance correction', time: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', name: 'Raza Khan', type: 'Document access', time: new Date(Date.now() - 86400000).toISOString() },
]

export function DashboardPage() {
  const { user } = useAuth()
  const greeting = getGreeting()
  const firstName = user?.firstName ?? 'there'

  return (
    <PageContainer>
      {/* ── Dashboard Hero ─────────────────────────────────────────────── */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)]/60 bg-gradient-to-br from-[var(--dw-color-brand-primary-subtle)] via-[var(--dw-color-surface-base)] to-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-sm)]">

        {/* Animated border beam */}
        <BorderBeam duration={14} size={300} />

        {/* Pulsing grid background */}
        <PulsingGrid cols={16} rows={5} className="opacity-60" />

        {/* Meteors */}
        <Meteors number={8} />

        {/* 3D particles (behind everything) */}
        <Suspense fallback={null}>
          <DashboardParticles3D />
        </Suspense>

        {/* Decorative concentric rings — top-right */}
        <svg
          className="pointer-events-none absolute -right-20 -top-20 opacity-[0.07]"
          width="360" height="360" viewBox="0 0 360 360" aria-hidden="true"
        >
          {[40, 80, 120, 160, 200, 240].map((r, i) => (
            <motion.circle
              key={r} cx="200" cy="160" r={r}
              fill="none" stroke="var(--dw-color-brand-primary)" strokeWidth="1.5"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
              style={{ transformOrigin: '200px 160px' }}
            />
          ))}
        </svg>

        {/* Subtle diagonal shimmer line */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden="true">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--dw-color-brand-primary)" strokeWidth="120" />
        </svg>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto]">

          {/* Left — date → greeting → actions */}
          <div className="flex flex-col justify-between gap-5">

            {/* Top: date + day */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--dw-color-brand-primary)]/10">
                <span className="text-base leading-none">📅</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--dw-color-brand-primary)]">
                  {new Date().toLocaleDateString('en-PK', { weekday: 'long' })}
                </p>
                <p className="text-xs text-[var(--dw-color-ink-tertiary)]">
                  {new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Live pill */}
              <motion.div
                className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 sm:ml-2"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  className="size-1.5 rounded-full bg-emerald-500"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Workspace live
                </span>
              </motion.div>
            </motion.div>

            {/* Middle: greeting */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[var(--dw-color-brand-primary)]">{greeting}</p>
                {user?.role && (
                  <motion.span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${ROLE_BADGE_CLASS[user.role]}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {ROLE_LABELS[user.role]}
                  </motion.span>
                )}
              </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              <TextShimmer className="text-3xl font-semibold tracking-tight sm:text-4xl" duration={3.5}>
                {firstName}
              </TextShimmer>
              {' '}👋
            </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--dw-color-ink-secondary)]">
                {user?.role === 'super_admin'
                  ? 'You have full system access. Oversee all activity, manage admins, and configure DreamWeavers.'
                  : user?.role === 'admin'
                    ? "Here's what's happening across your team today. Approve requests, track attendance, and manage your people."
                    : "Welcome back! Here's your personal workspace — tasks, calendar, and attendance all in one place."}
              </p>
            </motion.div>

            {/* Bottom: quick actions */}
            <motion.div
              className="flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              {(user?.role === 'super_admin' || user?.role === 'admin') && (
                <MagneticButton>
                  <Button size="sm" variant="primary" asChild>
                    <Link to={ROUTES.employees}>
                      <Users className="mr-1.5 size-3.5" />
                      View employees
                      <ArrowUpRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </MagneticButton>
              )}
              <MagneticButton>
                <Button size="sm" variant="secondary" asChild>
                  <Link to={ROUTES.attendance}>
                    <Clock className="mr-1.5 size-3.5" />
                    Clock in
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button size="sm" variant="ghost" asChild>
                  <Link to={ROUTES.tasks}>
                    <CheckCircle2 className="mr-1.5 size-3.5" />
                    My tasks
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right — live workspace pulse */}
          <DashboardHeroVisual />
        </div>
      </div>

      <StaggerContainer className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StaggerItem>
            <StatCard label="Total Employees" value={247} delta="+12 this month" deltaPositive icon={<Users className="size-[18px]" />} accent="brand" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Present today" value={89} suffix="%" delta="+2.4%" deltaPositive icon={<CheckCircle2 className="size-[18px]" />} accent="green" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Pending approvals" value={7} icon={<Clock className="size-[18px]" />} accent="amber" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Tasks completed" value={128} delta="This week" icon={<TrendingUp className="size-[18px]" />} accent="violet" />
          </StaggerItem>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <StaggerItem>
            <BentoWidget
              title="Attendance trend"
              action={
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link to={ROUTES.attendance}>
                    View all
                    <ArrowUpRight className="size-3" />
                  </Link>
                </Button>
              }
            >
              <AnimatedAreaChart data={CHART_DATA} />
            </BentoWidget>
          </StaggerItem>

          <StaggerItem>
            <BentoWidget
              title="Approval queue"
              action={<Badge variant="warning">7 pending</Badge>}
            >
              <ul className="space-y-3">
                {APPROVALS.map((item, i) => (
                  <motion.li
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--dw-color-surface-sunken)]"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                  >
                    <Avatar className="size-9">
                      <AvatarFallback>{item.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="truncate text-xs text-[var(--dw-color-ink-tertiary)]">{item.type}</p>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--dw-color-ink-tertiary)]">
                      {formatRelativeTime(item.time)}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </BentoWidget>
          </StaggerItem>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <StaggerItem>
            <BentoWidget title="Tasks snapshot">
              <KanbanPreview />
            </BentoWidget>
          </StaggerItem>

          <StaggerItem>
            <PremiumCard className="flex h-full flex-col justify-between p-5" variant="glass">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--dw-color-ink-tertiary)]">
                  Quick action
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--dw-color-ink-primary)]">
                  Ready to clock in?
                </h3>
                <p className="mt-1 text-sm text-[var(--dw-color-ink-secondary)]">
                  Record your attendance for today in one tap.
                </p>
              </div>
              <Button className="mt-6 w-full" size="lg" asChild>
                <Link to={ROUTES.attendance}>Clock in now</Link>
              </Button>
            </PremiumCard>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </PageContainer>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Live workspace pulse — universal hero visual ──────────────────────────────
const SPARKLINE = [72, 68, 81, 77, 88, 84, 94]
const TEAM = [
  { initials: 'AY', color: '#4A7C92', online: true  },
  { initials: 'OF', color: '#2d6a7f', online: true  },
  { initials: 'ZM', color: '#6ea8be', online: true  },
  { initials: 'BA', color: '#3a8fa0', online: false },
  { initials: 'SM', color: '#5b9cb0', online: true  },
]

const METRICS = [
  { label: 'Present today',    value: '89%',  icon: '✅', positive: true  },
  { label: 'Pending actions',  value: '7',    icon: '⏳', positive: false },
  { label: 'Total Employees',  value: '247',  icon: '👥', positive: true  },
]

function LiveClock() {
  const [time, setTime] = useState(() => {
    const d = new Date()
    return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
  })
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setTime(d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }))
    }, 10_000)
    return () => clearInterval(id)
  }, [])
  return <span className="tabular-nums">{time}</span>
}

function DashboardHeroVisual() {
  const maxVal = Math.max(...SPARKLINE)
  const pts = SPARKLINE.map(
    (v, i) => `${(i / (SPARKLINE.length - 1)) * 96},${28 - (v / maxVal) * 24}`,
  ).join(' ')

  return (
    <motion.div
      className="hidden shrink-0 lg:flex lg:items-center lg:gap-3"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* ── Column 1: clock + sparkline ─────────────── */}
      <div className="flex flex-col gap-2.5">
        {/* Live clock chip */}
        <motion.div
          className="flex items-center gap-2 rounded-xl border border-[var(--dw-color-border-default)]/60 bg-[var(--dw-color-surface-base)]/80 px-3.5 py-2.5 shadow-[var(--dw-shadow-sm)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.03 }}
        >
          <motion.span
            className="size-2 rounded-full bg-emerald-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-xs font-semibold text-[var(--dw-color-ink-primary)]">
            <LiveClock />
          </span>
          <span className="text-xs text-[var(--dw-color-ink-tertiary)]">Live</span>
        </motion.div>

        {/* Sparkline — attendance this week */}
        <motion.div
          className="rounded-xl border border-[var(--dw-color-border-default)]/60 bg-[var(--dw-color-surface-base)]/80 px-3.5 py-2.5 shadow-[var(--dw-shadow-sm)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.03 }}
        >
          <p className="mb-1.5 text-[10px] font-medium text-[var(--dw-color-ink-tertiary)]">
            Attendance · this week
          </p>
          <svg viewBox="0 0 96 30" className="h-7 w-24" aria-hidden="true">
            <defs>
              <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A7C92" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4A7C92" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.polyline
              points={pts}
              fill="none"
              stroke="#4A7C92"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              animate={{ strokeDashoffset: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
            />
            {/* Last dot */}
            <motion.circle
              cx={96} cy={28 - (SPARKLINE[SPARKLINE.length - 1] / maxVal) * 24}
              r="2.5" fill="#4A7C92"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 400 }}
              style={{ transformOrigin: `96px ${28 - (SPARKLINE[SPARKLINE.length - 1] / maxVal) * 24}px` }}
            />
          </svg>
          <p className="mt-1 text-[10px] font-bold text-[var(--dw-color-brand-primary)]">
            94% ↑
          </p>
        </motion.div>
      </div>

      {/* ── Column 2: metric chips ───────────────────── */}
      <div className="flex flex-col gap-2.5">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            className="flex items-center gap-2.5 rounded-xl border border-[var(--dw-color-border-default)]/60 bg-[var(--dw-color-surface-base)]/80 px-3.5 py-2.5 shadow-[var(--dw-shadow-sm)] backdrop-blur-sm"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <span className="text-base leading-none">{m.icon}</span>
            <div>
              <p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">{m.label}</p>
              <p className={`text-sm font-bold ${m.positive ? 'text-[var(--dw-color-ink-primary)]' : 'text-amber-500'}`}>
                {m.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Column 3: team presence ──────────────────── */}
      <motion.div
        className="flex flex-col gap-2 rounded-xl border border-[var(--dw-color-border-default)]/60 bg-[var(--dw-color-surface-base)]/80 px-3.5 py-3 shadow-[var(--dw-shadow-sm)] backdrop-blur-sm"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45 }}
        whileHover={{ scale: 1.02 }}
      >
        <p className="text-[10px] font-medium text-[var(--dw-color-ink-tertiary)]">Team online</p>
        <div className="flex flex-col gap-1.5">
          {TEAM.map((t, i) => (
            <motion.div
              key={t.initials}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
            >
              <div
                className="relative flex size-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: t.color }}
              >
                {t.initials}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full ring-1 ring-[var(--dw-color-surface-base)] ${t.online ? 'bg-emerald-500' : 'bg-[var(--dw-color-ink-disabled)]'}`}
                />
              </div>
              <span className="text-[10px] text-[var(--dw-color-ink-secondary)]">{t.initials}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-1 text-[10px] font-semibold text-emerald-500">4 / 5 online</p>
      </motion.div>
    </motion.div>
  )
}
