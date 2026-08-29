import { motion } from 'framer-motion'
import { BorderBeam } from '@/shared/components/effects/border-beam'
import { NumberTicker } from '@/shared/components/effects/number-ticker'
import { SpotlightCard } from '@/shared/components/effects/spotlight'

const STAT_CONFIG = [
  {
    key: 'total',
    label: 'Team Members',
    icon: '👥',
    gradient: 'from-[#4a7c92]/15 via-[#edf5f8] to-[#4a7c92]/5',
    border: 'border-[#c5dde6]',
    color: 'text-[#4a7c92]',
    beamFrom: '#4a7c92',
    beamTo: '#7ab5cc',
    spotlight: 'rgba(74,124,146,0.15)',
  },
  {
    key: 'active',
    label: 'Active',
    icon: '✅',
    gradient: 'from-emerald-500/10 via-emerald-50 to-emerald-500/5',
    border: 'border-emerald-200',
    color: 'text-emerald-600',
    beamFrom: '#10b981',
    beamTo: '#34d399',
    spotlight: 'rgba(16,185,129,0.12)',
  },
  {
    key: 'hr',
    label: 'HR Staff',
    icon: '🛡️',
    gradient: 'from-violet-500/10 via-violet-50 to-violet-500/5',
    border: 'border-violet-200',
    color: 'text-violet-600',
    beamFrom: '#7c3aed',
    beamTo: '#a78bfa',
    spotlight: 'rgba(124,58,237,0.12)',
  },
  {
    key: 'onLeave',
    label: 'On Leave',
    icon: '🌴',
    gradient: 'from-amber-500/10 via-amber-50 to-amber-500/5',
    border: 'border-amber-200',
    color: 'text-amber-600',
    beamFrom: '#f59e0b',
    beamTo: '#fbbf24',
    spotlight: 'rgba(245,158,11,0.12)',
  },
  {
    key: 'departments',
    label: 'Departments',
    icon: '🏢',
    gradient: 'from-sky-500/10 via-sky-50 to-sky-500/5',
    border: 'border-sky-200',
    color: 'text-sky-600',
    beamFrom: '#0284c7',
    beamTo: '#38bdf8',
    spotlight: 'rgba(2,132,199,0.12)',
  },
] as const

interface EmployeeStatCardsProps {
  stats: Record<(typeof STAT_CONFIG)[number]['key'], number>
}

export function EmployeeStatCards({ stats }: EmployeeStatCardsProps) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {STAT_CONFIG.map((cfg, i) => (
        <motion.div
          key={cfg.key}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, delay: i * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <SpotlightCard
            className={`relative overflow-hidden rounded-2xl border ${cfg.border} bg-gradient-to-br ${cfg.gradient}`}
            spotlightColor={cfg.spotlight}
          >
            <BorderBeam
              size={120}
              duration={8 + i}
              delay={i * 0.5}
              colorFrom={cfg.beamFrom}
              colorTo={cfg.beamTo}
              borderWidth={1.5}
            />
            <div className="relative flex items-center gap-3 px-3.5 py-3">
              <motion.span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm backdrop-blur-sm"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
              >
                {cfg.icon}
              </motion.span>
              <div>
                <NumberTicker
                  value={stats[cfg.key]}
                  className={`text-2xl font-black leading-none ${cfg.color}`}
                  delay={0.1 + i * 0.05}
                />
                <p className="mt-0.5 text-[10px] font-semibold text-[var(--dw-color-ink-tertiary)]">
                  {cfg.label}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      ))}
    </div>
  )
}
