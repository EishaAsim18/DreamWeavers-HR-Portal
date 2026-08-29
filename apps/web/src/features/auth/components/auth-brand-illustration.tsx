/**
 * Animated floating product UI cards shown on the auth brand panel.
 * Mimics a live mini-dashboard to showcase the product value.
 *
 * Uses Framer Motion only — no Three.js overhead needed here.
 */
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, Clock, Sparkles, TrendingUp, Users } from 'lucide-react'

const spring = { type: 'spring', stiffness: 260, damping: 26 } as const

// ── Shared card wrapper ───────────────────────────────────────────────────────
function FloatingCard({
  children,
  className,
  delay = 0,
  floatY = 8,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  floatY?: number
}) {
  return (
    <motion.div
      className={`absolute rounded-2xl border border-white/[0.12] bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-md dark:border-white/[0.08] dark:bg-black/[0.25] ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ scale: 1.03, transition: spring }}
    >
      <motion.div
        animate={{ y: [0, -floatY, 0] }}
        transition={{ duration: 4 + delay * 2, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ── Avatar cluster ────────────────────────────────────────────────────────────
const TEAM = [
  { initials: 'AY', bg: '#4A7C92' },
  { initials: 'OF', bg: '#2d6a7f' },
  { initials: 'ZM', bg: '#6ea8be' },
  { initials: 'BA', bg: '#3a8fa0' },
  { initials: 'SM', bg: '#5b9cb0' },
]

function AvatarStack() {
  return (
    <div className="flex items-center">
      {TEAM.map((a, i) => (
        <motion.div
          key={a.initials}
          className="flex size-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white/20"
          style={{ background: a.bg, marginLeft: i === 0 ? 0 : -10, zIndex: i }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.06 }}
        >
          {a.initials}
        </motion.div>
      ))}
      <span className="ml-2 text-xs text-white/60">+242</span>
    </div>
  )
}

// ── Bar sparkline ─────────────────────────────────────────────────────────────
const BARS = [55, 72, 64, 88, 76, 92, 85]

function MiniBar() {
  return (
    <div className="flex h-8 items-end gap-[3px]">
      {BARS.map((h, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-sm bg-[#4A7C92]/70"
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: 0.6 + i * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
      ))}
    </div>
  )
}

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-[#4A7C92]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

// ── Mini progress bar ─────────────────────────────────────────────────────────
function ProgressBar({ value, delay }: { value: number; delay: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#4A7C92] to-[#7ab5cc]"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ delay, duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
      />
    </div>
  )
}

// ── Main illustration ─────────────────────────────────────────────────────────
export function AuthBrandIllustration() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), spring)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), spring)

  return (
    <div
      ref={containerRef}
      className="relative h-[420px] w-full"
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ rotateX, rotateY, transformPerspective: 900 }}
      >
        {/* ── Card 1: Headcount ─────────────────────────────────────── */}
        <FloatingCard className="left-0 top-4 w-[188px] p-4" delay={0.15} floatY={7}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#4A7C92]/20">
              <Users className="size-4 text-[#7ab5cc]" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              <TrendingUp className="size-2.5" />
              +12
            </span>
          </div>
          <p className="text-[11px] font-medium text-white/50">Total Headcount</p>
          <motion.p
            className="mt-0.5 text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <CountUp to={247} />
          </motion.p>
          <div className="mt-3">
            <AvatarStack />
          </div>
        </FloatingCard>

        {/* ── Card 2: Attendance ──────────────────────────────────────── */}
        <FloatingCard className="right-0 top-0 w-[172px] p-4" delay={0.28} floatY={10}>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] font-semibold text-white/70">Attendance</p>
          </div>
          <p className="text-2xl font-bold text-white">94<span className="text-base text-white/50">%</span></p>
          <div className="mt-2 space-y-2">
            {[
              { label: 'Present', value: 94 },
              { label: 'Remote', value: 28 },
            ].map((row, i) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between text-[10px] text-white/40">
                  <span>{row.label}</span>
                  <span>{row.value}%</span>
                </div>
                <ProgressBar value={row.value} delay={0.7 + i * 0.15} />
              </div>
            ))}
          </div>
        </FloatingCard>

        {/* ── Card 3: Weekly trend ─────────────────────────────────────── */}
        <FloatingCard className="left-6 top-[185px] w-[160px] p-4" delay={0.4} floatY={9}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-medium text-white/50">Weekly trend</p>
            <Clock className="size-3.5 text-[#7ab5cc]/70" />
          </div>
          <MiniBar />
          <p className="mt-2 text-xs text-white/40">Mon – Sun</p>
        </FloatingCard>

        {/* ── Card 4: Approvals ────────────────────────────────────────── */}
        <FloatingCard className="right-2 top-[170px] w-[176px] p-3.5" delay={0.5} floatY={6}>
          <p className="mb-2.5 text-[11px] font-semibold text-white/60">Pending approvals</p>
          {[
            { name: 'Bilal Ahmed', type: 'Leave' },
            { name: 'Sana Malik', type: 'Attendance' },
          ].map((row, i) => (
            <motion.div
              key={row.name}
              className="mb-2 flex items-center gap-2"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4A7C92]/30 text-[9px] font-bold text-[#7ab5cc]">
                {row.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium text-white/70">{row.name}</p>
                <p className="text-[9px] text-white/35">{row.type} request</p>
              </div>
            </motion.div>
          ))}
          <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-[#4A7C92]/20 px-2 py-1.5">
            <span className="text-[10px] font-semibold text-[#7ab5cc]">3 more waiting</span>
          </div>
        </FloatingCard>

        {/* ── Card 5: AI assistant ────────────────────────────────────── */}
        <FloatingCard className="bottom-0 left-1/2 w-[200px] -translate-x-1/2 p-3.5" delay={0.6} floatY={5}>
          <div className="flex items-center gap-2">
            <motion.div
              className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#4A7C92]/20"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="size-3.5 text-[#7ab5cc]" />
            </motion.div>
            <div>
              <p className="text-[10px] font-semibold text-white/70">DreamWeavers AI</p>
              <p className="text-[9px] text-white/35">Always ready to assist</p>
            </div>
          </div>
          <div className="mt-2.5 rounded-lg bg-white/[0.06] px-3 py-2">
            <p className="text-[10px] text-white/50">Summarize today&apos;s updates…</p>
            <div className="mt-1.5">
              <TypingDots />
            </div>
          </div>
        </FloatingCard>
      </motion.div>
    </div>
  )
}

// ── Counter animation ─────────────────────────────────────────────────────────
function CountUp({ to }: { to: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0 }}
    >
      <motion.span
        style={{ display: 'inline-block' }}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.01 }}
      >
        {to}
      </motion.span>
    </motion.span>
  )
}
