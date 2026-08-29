import { motion, type HTMLMotionProps } from 'framer-motion'
import { AnimatedCounter } from '@/shared/components/motion/animated-counter'
import { cn } from '@/shared/lib/utils'
import { SPRING } from '@/shared/lib/motion'
import { BorderBeam } from '@/shared/components/effects/border-beam'
import { SpotlightCard } from '@/shared/components/effects/spotlight'

// ── PremiumCard ───────────────────────────────────────────────────────────────
type PremiumCardProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  interactive?: boolean
  variant?: 'default' | 'glass' | 'elevated'
  children?: React.ReactNode
}

const variantClass = {
  default: 'premium-card',
  glass: 'premium-card glass-panel',
  elevated: 'premium-card premium-card-elevated',
}

export function PremiumCard({
  children,
  className,
  interactive = false,
  variant = 'default',
  ...props
}: PremiumCardProps) {
  return (
    <motion.div
      className={cn(variantClass[variant], interactive && 'cursor-pointer', className)}
      whileHover={interactive ? { y: -2, transition: SPRING.gentle } : undefined}
      whileTap={interactive ? { scale: 0.995, transition: SPRING.button } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ── BentoWidget ───────────────────────────────────────────────────────────────
interface BentoWidgetProps {
  title: string
  action?: React.ReactNode
  noPadding?: boolean
  className?: string
  children?: React.ReactNode
}

export function BentoWidget({ title, action, children, className, noPadding }: BentoWidgetProps) {
  return (
    <PremiumCard className={cn('flex flex-col overflow-hidden', !noPadding && 'p-5', className)}>
      <div
        className={cn(
          'flex items-center justify-between gap-3',
          !noPadding ? 'mb-4' : 'border-b border-[var(--dw-color-border-default)] px-5 py-4',
        )}
      >
        <h3 className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">{title}</h3>
        {action}
      </div>
      <div className={cn('flex-1', noPadding && 'p-5 pt-0')}>{children}</div>
    </PremiumCard>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: number
  suffix?: string
  delta?: string
  deltaPositive?: boolean
  icon: React.ReactNode
  /** Accent color preset — controls the icon bg gradient and beam color */
  accent?: 'brand' | 'green' | 'amber' | 'violet' | 'rose'
  className?: string
}

const ACCENT = {
  brand:  { gradient: 'from-[#4a7c92] to-[#7ab5cc]', icon: 'bg-[#ddedf2] text-[#4a7c92]',   beam: '#4a7c92', glow: 'rgba(74,124,146,0.18)'  },
  green:  { gradient: 'from-[#16a34a] to-[#4ade80]', icon: 'bg-[#dcfce7] text-[#16a34a]',   beam: '#22c55e', glow: 'rgba(34,197,94,0.15)'   },
  amber:  { gradient: 'from-[#d97706] to-[#fbbf24]', icon: 'bg-[#fef3c7] text-[#d97706]',   beam: '#f59e0b', glow: 'rgba(245,158,11,0.15)'  },
  violet: { gradient: 'from-[#7c3aed] to-[#a78bfa]', icon: 'bg-[#ede9fe] text-[#7c3aed]',   beam: '#8b5cf6', glow: 'rgba(139,92,246,0.15)'  },
  rose:   { gradient: 'from-[#e11d48] to-[#fb7185]', icon: 'bg-[#ffe4e6] text-[#e11d48]',   beam: '#f43f5e', glow: 'rgba(244,63,94,0.15)'   },
}

export function StatCard({
  label,
  value,
  suffix,
  delta,
  deltaPositive,
  icon,
  accent = 'brand',
  className,
}: StatCardProps) {
  const a = ACCENT[accent]

  return (
    <SpotlightCard
      className={cn('premium-card rounded-2xl overflow-hidden', className)}
      spotlightColor={a.glow}
    >
      <BorderBeam duration={16} size={200} colorFrom={a.beam} colorTo="transparent" />

      {/* Top gradient bar */}
      <div className={cn('h-0.5 w-full bg-gradient-to-r', a.gradient)} />

      <motion.div
        className="p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        whileHover={{ y: -1 }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icon with gradient glow */}
          <motion.div
            className={cn(
              'relative flex size-11 items-center justify-center rounded-xl shadow-[var(--dw-shadow-sm)]',
              a.icon,
            )}
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={SPRING.button}
          >
            {/* Subtle gradient ring */}
            <div className={cn('absolute inset-0 rounded-xl bg-gradient-to-br opacity-20', a.gradient)} />
            <span className="relative z-[1]">{icon}</span>
          </motion.div>

          {delta && (
            <motion.span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                deltaPositive
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : 'bg-[var(--dw-color-surface-sunken)] text-[var(--dw-color-ink-tertiary)]',
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {delta}
            </motion.span>
          )}
        </div>

        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dw-color-ink-tertiary)]">
          {label}
        </p>
        <p className="mt-1 text-[2rem] font-bold tracking-tight text-[var(--dw-color-ink-primary)]">
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
      </motion.div>
    </SpotlightCard>
  )
}
