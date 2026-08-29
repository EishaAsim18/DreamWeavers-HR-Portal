import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ShieldPlus, UserPlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { BorderBeam } from '@/shared/components/effects/border-beam'

const EmployeesScene3D = lazy(() =>
  import('@/shared/components/three/employees-scene-3d').then((m) => ({
    default: m.EmployeesScene3D,
  })),
)

interface EmployeesHeroProps {
  firstName: string
  roleLabel: string
  totalCount: number
  canCreateEmployee: boolean
  canCreateHR: boolean
  onAddEmployee: () => void
}

export function EmployeesHero({
  firstName,
  roleLabel,
  totalCount,
  canCreateEmployee,
  canCreateHR,
  onAddEmployee,
}: EmployeesHeroProps) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl border border-[var(--dw-color-border-default)] bg-gradient-to-br from-[#0d1b24] via-[#132c3a] to-[#1b1440] shadow-[var(--dw-shadow-md)]">
      {/* 3D team network — lazy loaded */}
      <Suspense fallback={null}>
        <EmployeesScene3D />
      </Suspense>

      {/* Color washes */}
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#4a7c92]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#7c3aed]/25 blur-3xl" />

      <BorderBeam size={220} duration={11} colorFrom="#4a7c92" colorTo="#7c3aed" borderWidth={1.5} />

      <div className="relative z-10 flex flex-col gap-5 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <motion.p
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7ab5cc]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {roleLabel} · Team Directory
          </motion.p>
          <motion.h1
            className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            Your people,{' '}
            <span className="bg-gradient-to-r from-[#7ab5cc] via-[#a78bfa] to-[#7ab5cc] bg-clip-text text-transparent">
              {firstName}.
            </span>
          </motion.h1>
          <motion.p
            className="mt-2 max-w-md text-[13.5px] leading-relaxed text-white/60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            {totalCount} team member{totalCount === 1 ? '' : 's'} across the organisation.
            Manage profiles, roles and onboarding from one place.
          </motion.p>
        </div>

        <motion.div
          className="flex shrink-0 flex-wrap items-center gap-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {canCreateHR && (
            <div className="rounded-xl border border-violet-300/30 bg-violet-500/15 px-3 py-2 text-[11px] leading-tight text-violet-200 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldPlus className="size-3.5" /> Super Admin privileges
              </span>
              You can create HR accounts
            </div>
          )}
          {canCreateEmployee && (
            <Button onClick={onAddEmployee} className="gap-1.5 shadow-lg shadow-[#4a7c92]/30">
              <UserPlus className="size-4" />
              Add member
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
