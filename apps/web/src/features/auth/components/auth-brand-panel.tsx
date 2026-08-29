import { motion } from 'framer-motion'
import { ANIMATION } from '@/shared/constants'
import { BackgroundBeams } from '@/shared/components/effects/background-beams'
import { HeroStatue } from '@/features/auth/components/hero-statue'
import {
  UsersRound,
  LayoutList,
  Link2,
  ShieldCheck,
  Sparkles,
  BarChart2,
  Clock,
  CheckCircle2,
} from 'lucide-react'

const FEATURES = [
  { icon: UsersRound,  label: 'Smart HR',       sub: 'People first',          color: '#4A7C92', bg: 'rgba(74,124,146,0.12)' },
  { icon: LayoutList,  label: 'Productivity',   sub: 'Tasks that flow',       color: '#4a7c92', bg: 'rgba(74,124,146,0.1)' },
  { icon: Link2,       label: 'Collaboration',  sub: 'Teams that sync',       color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  { icon: ShieldCheck, label: 'Security First', sub: 'Your data, protected',  color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  { icon: Sparkles,    label: 'AI Insights',    sub: 'Decisions that drive',  color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  { icon: BarChart2,   label: 'Reports',        sub: 'Insights that matter',  color: '#e11d48', bg: 'rgba(225,29,72,0.1)' },
]

const STATS = [
  { icon: UsersRound,   value: '12K+', label: 'Active Users' },
  { icon: CheckCircle2, value: '98%',  label: 'Attendance Rate' },
  { icon: Clock,        value: '24/7', label: 'Support' },
  { icon: ShieldCheck,  value: '100%', label: 'Data Secure' },
]

export function AuthBrandPanel() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden px-8 py-8 lg:px-12 lg:py-9 xl:px-14">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#ddedf2] to-[var(--dw-color-brand-primary-subtle)]" />
      <BackgroundBeams className="opacity-20" />

      {/* Dot grid */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.045]" aria-hidden="true">
        <defs>
          <pattern id="brand-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="var(--dw-color-brand-primary)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brand-dots)" />
      </svg>

      {/* Subtle logo watermark */}
      <div className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.04]">
        <img src="/dreamweavers-mark.svg" alt="" className="h-72 w-auto xl:h-80" draggable={false} />
      </div>

      {/* Logo — top left */}
      <motion.div
        className="relative z-10 flex items-center gap-2.5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION.slow }}
      >
        <img src="/dreamweavers-logo.png" alt="DreamWeavers" width={32} height={32} className="object-contain" />
        <div className="leading-[1.1]">
          <p className="text-[11px] font-black tracking-[0.15em] text-[var(--dw-color-ink-primary)]">DREAM</p>
          <p className="text-[11px] font-black tracking-[0.15em] text-[var(--dw-color-ink-primary)]">WEAVERS</p>
        </div>
      </motion.div>

      {/* Main hero */}
      <div className="relative z-10 my-auto flex min-h-0 flex-1 flex-col justify-center pt-4">
        <div className="mx-auto w-full max-w-xl space-y-5">
          {/* Hero statue — fully above the headline, no overlap */}
          <motion.div
            className="flex justify-center pb-3"
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: ANIMATION.slow, delay: 0.05 }}
            aria-hidden="true"
          >
            {/* Height scales with viewport so text & cards below never get cut */}
            <HeroStatue className="h-[clamp(170px,30vh,360px)]" />
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION.slow, delay: 0.12 }}
          >
            <h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-tight text-[var(--dw-color-ink-primary)] xl:text-[2.1rem]">
              Where work comes{' '}
              <span className="bg-gradient-to-r from-[var(--dw-color-brand-primary)] to-[#6bafcc] bg-clip-text text-transparent">
                together.
              </span>
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-[13.5px] leading-relaxed text-[var(--dw-color-ink-secondary)]">
              DreamWeavers HRMS unifies HR, productivity, and collaboration in one
              intelligent workspace for modern teams.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-2.5 xl:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            {FEATURES.map(({ icon: Icon, label, sub, color, bg }, i) => (
              <motion.div
                key={label}
                className="flex items-start gap-2.5 rounded-xl border border-[var(--dw-color-border-default)]/60 bg-white/85 p-3 shadow-[var(--dw-shadow-xs)] backdrop-blur-sm transition-shadow hover:shadow-[var(--dw-shadow-sm)]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 + i * 0.04 }}
                whileHover={{ y: -1 }}
              >
                <div className="flex size-[28px] shrink-0 items-center justify-center rounded-lg" style={{ background: bg }}>
                  <Icon className="size-3.5" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-semibold leading-tight text-[var(--dw-color-ink-primary)]">{label}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-[var(--dw-color-ink-tertiary)]">{sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        className="relative z-10 mt-4 rounded-2xl border border-[var(--dw-color-border-default)]/50 bg-white/85 p-4 shadow-[var(--dw-shadow-sm)] backdrop-blur-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              className={`flex flex-1 items-center gap-2.5 ${
                i < STATS.length - 1
                  ? 'mr-3 border-r border-[var(--dw-color-border-default)]/50 pr-3'
                  : ''
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 + i * 0.055 }}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--dw-color-brand-primary-muted)]">
                <Icon className="size-[15px] text-[var(--dw-color-brand-primary)]" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-[var(--dw-color-ink-primary)]">{value}</p>
                <p className="mt-0.5 text-[10px] leading-none text-[var(--dw-color-ink-tertiary)]">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        className="relative z-10 mt-3 text-xs text-[var(--dw-color-ink-tertiary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        © {new Date().getFullYear()} DreamWeavers. All rights reserved.
      </motion.p>
    </div>
  )
}
