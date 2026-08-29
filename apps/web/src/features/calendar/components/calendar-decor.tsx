import { motion } from 'framer-motion'
import { AnimatedBlob } from '@/shared/components/effects/blob'
import { CalendarIllustration } from '@/shared/components/illustrations/calendar-illustration'

/** Floating gradient orbs behind the calendar hero */
export function CalendarFloatingOrbs() {
  const orbs = [
    { color: '#4a7c92', size: 280, x: '8%', y: '12%', delay: 0, duration: 14 },
    { color: '#7c3aed', size: 200, x: '78%', y: '8%', delay: 1.2, duration: 18 },
    { color: '#0891b2', size: 160, x: '85%', y: '55%', delay: 0.6, duration: 16 },
    { color: '#f97316', size: 120, x: '5%', y: '65%', delay: 2, duration: 20 },
    { color: '#10b981', size: 100, x: '45%', y: '85%', delay: 0.8, duration: 22 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}35 0%, ${orb.color}08 50%, transparent 70%)`,
          }}
          animate={{
            x: [0, 20, -15, 10, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.08, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  )
}

/** Decorative grid dots */
export function CalendarDotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      aria-hidden="true"
      style={{
        backgroundImage: `radial-gradient(circle, var(--dw-color-brand-primary) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)',
      }}
    />
  )
}

/** Animated SVG sparkles */
export function CalendarSparkles() {
  const sparks = [
    { x: 12, y: 20, size: 4, delay: 0 },
    { x: 88, y: 15, size: 3, delay: 0.5 },
    { x: 95, y: 70, size: 5, delay: 1 },
    { x: 8, y: 75, size: 3, delay: 1.5 },
    { x: 50, y: 8, size: 4, delay: 0.8 },
  ]

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {sparks.map((s, i) => (
        <motion.circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.size}
          fill="var(--dw-color-brand-primary)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  )
}

/** Hero banner with illustration + blobs */
export function CalendarHeroBanner({
  greeting,
  firstName,
  roleLabel,
  dateLabel,
  isLoading,
}: {
  greeting: string
  firstName: string
  roleLabel: string
  dateLabel: string
  isLoading: boolean
}) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-surface-base)] via-[#edf5f8]/40 to-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-md)]">
      <CalendarFloatingOrbs />
      <CalendarDotGrid />
      <CalendarSparkles />

      {/* Gradient mesh overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 50% 80% at 0% 50%, rgba(74,124,146,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 100% 20%, rgba(124,58,237,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 30% 50% at 80% 90%, rgba(8,145,178,0.06) 0%, transparent 40%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        {/* Left: text */}
        <div className="min-w-0 flex-1">
          <motion.p
            className="mb-1 text-xs font-semibold text-[var(--dw-color-brand-primary)]"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {greeting}, {firstName}
          </motion.p>

          <motion.h1
            className="calendar-title-shimmer bg-gradient-to-r from-[#2d5a6e] via-[var(--dw-color-brand-primary)] to-[#7ab5cc] bg-clip-text text-[2rem] font-black tracking-tight text-transparent sm:text-[2.25rem]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            Your Calendar
          </motion.h1>

          <motion.div
            className="mt-2 flex flex-wrap items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dw-color-brand-primary)]/25 bg-[var(--dw-color-brand-primary-muted)] px-3 py-1 text-[11px] font-bold text-[var(--dw-color-brand-primary)]">
              {roleLabel}
            </span>
            <span className="text-xs text-[var(--dw-color-ink-tertiary)]">{dateLabel}</span>
            {isLoading && (
              <motion.span
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <span className="size-1.5 rounded-full bg-amber-500" />
                Syncing…
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Right: illustration + blobs */}
        <motion.div
          className="relative hidden shrink-0 sm:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnimatedBlob
            color="#4a7c92"
            size={140}
            duration={10}
            className="absolute -right-4 -top-6 opacity-20"
          />
          <AnimatedBlob
            color="#7c3aed"
            size={90}
            duration={12}
            className="absolute -bottom-2 -left-6 opacity-15"
          />
          <div className="relative drop-shadow-lg">
            <CalendarIllustration />
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient accent bar */}
      <div className="calendar-rainbow-bar h-1 w-full" aria-hidden="true" />
    </div>
  )
}

/** Priority color legend with animated dots */
export function PriorityLegendBar() {
  const items = [
    { color: '#ef4444', label: 'Urgent', glow: 'rgba(239,68,68,0.4)' },
    { color: '#f97316', label: 'High', glow: 'rgba(249,115,22,0.4)' },
    { color: '#4a7c92', label: 'Medium', glow: 'rgba(74,124,146,0.4)' },
    { color: '#94a3b8', label: 'Low', glow: 'rgba(148,163,184,0.3)' },
    { color: '#8b5cf6', label: 'Meeting', glow: 'rgba(139,92,246,0.4)' },
  ]

  return (
    <motion.div
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--dw-color-border-default)] bg-gradient-to-r from-[var(--dw-color-surface-base)] to-[var(--dw-color-surface-sunken)] px-4 py-3 shadow-[var(--dw-shadow-xs)]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dw-color-ink-tertiary)]">
          Legend
        </span>
        {items.map((item, i) => (
          <motion.span
            key={item.label}
            className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--dw-color-ink-secondary)]"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
          >
            <motion.span
              className="size-2.5 rounded-full"
              style={{ background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
            {item.label}
          </motion.span>
        ))}
      </div>
      <p className="text-[10px] text-[var(--dw-color-ink-tertiary)]">
        Drag tasks to reschedule · Click to view details
      </p>
    </motion.div>
  )
}
