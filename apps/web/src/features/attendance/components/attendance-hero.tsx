import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { BorderBeam } from '@/shared/components/effects/border-beam'

interface AttendanceHeroProps {
  firstName: string
  roleLabel: string
  clockedIn: boolean
}

export function AttendanceHero({ firstName, roleLabel, clockedIn }: AttendanceHeroProps) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[#0d1b24] via-[#132c3a] to-[#1b1440] shadow-[var(--dw-shadow-md)]">
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#4a7c92]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#10b981]/20 blur-3xl" />

      <BorderBeam size={220} duration={11} colorFrom="#4a7c92" colorTo="#10b981" borderWidth={1.5} />

      <div className="relative z-10 flex flex-col gap-4 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <motion.p
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7ab5cc]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {roleLabel} · Attendance
          </motion.p>
          <motion.h1
            className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            Good {getGreeting()},{' '}
            <span className="bg-gradient-to-r from-[#7ab5cc] via-[#34d399] to-[#7ab5cc] bg-clip-text text-transparent">
              {firstName}.
            </span>
          </motion.h1>
          <motion.p
            className="mt-2 max-w-md text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
          >
            {clockedIn
              ? 'You are currently clocked in. Remember to clock out when you finish.'
              : 'Track your work hours, view history, and request corrections.'}
          </motion.p>
        </div>

        <motion.div
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div
            className={`flex size-12 items-center justify-center rounded-xl ${
              clockedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
            }`}
          >
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Status</p>
            <p className={`text-lg font-semibold ${clockedIn ? 'text-emerald-400' : 'text-white'}`}>
              {clockedIn ? 'On Duty' : 'Off Duty'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
