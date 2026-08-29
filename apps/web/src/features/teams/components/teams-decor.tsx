import { motion } from 'framer-motion'
import { AnimatedBlob } from '@/shared/components/effects/blob'
import { EmployeesIllustration } from '@/shared/components/illustrations'
import {
  CalendarFloatingOrbs,
  CalendarDotGrid,
  CalendarSparkles,
} from '@/features/calendar/components/calendar-decor'

/** Hero banner for the Teams page — mirrors the Calendar/Tasks hero styling. */
export function TeamsHeroBanner({
  greeting,
  firstName,
  roleLabel,
  teamCount,
  isLoading,
}: {
  greeting: string
  firstName: string
  roleLabel: string
  teamCount: number
  isLoading: boolean
}) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[var(--dw-color-surface-base)] via-[#f3edfb]/40 to-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-md)]">
      <CalendarFloatingOrbs />
      <CalendarDotGrid />
      <CalendarSparkles />

      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 50% 80% at 0% 50%, rgba(124,58,237,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 100% 20%, rgba(74,124,146,0.10) 0%, transparent 50%),
            radial-gradient(ellipse 30% 50% at 80% 90%, rgba(8,145,178,0.06) 0%, transparent 40%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0 flex-1">
          <motion.p
            className="mb-1 text-xs font-semibold text-[#7c3aed]"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {greeting}, {firstName}
          </motion.p>

          <motion.h1
            className="bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a78bfa] bg-clip-text text-[2rem] font-black tracking-tight text-transparent sm:text-[2.25rem]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            Teams
          </motion.h1>

          <motion.div
            className="mt-2 flex flex-wrap items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7c3aed]/25 bg-[#7c3aed]/10 px-3 py-1 text-[11px] font-bold text-[#7c3aed]">
              {roleLabel}
            </span>
            <span className="text-xs text-[var(--dw-color-ink-tertiary)]">
              {teamCount} {teamCount === 1 ? 'team' : 'teams'} across the org
            </span>
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

        <motion.div
          className="relative hidden shrink-0 sm:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnimatedBlob color="#7c3aed" size={140} duration={10} className="absolute -right-4 -top-6 opacity-20" />
          <AnimatedBlob color="#4a7c92" size={90} duration={12} className="absolute -bottom-2 -left-6 opacity-15" />
          <div className="relative drop-shadow-lg">
            <EmployeesIllustration />
          </div>
        </motion.div>
      </div>

      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #7c3aed, #4a7c92, #0891b2, #9333ea)' }}
        aria-hidden="true"
      />
    </div>
  )
}
