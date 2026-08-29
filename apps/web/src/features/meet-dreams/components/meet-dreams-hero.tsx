import { motion } from 'framer-motion'

interface MeetDreamsHeroProps {
  unreadCount: number
}

export function MeetDreamsHero({ unreadCount }: MeetDreamsHeroProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--dw-color-border-default)] bg-gradient-to-r from-[#0d1a1f] via-[#123039] to-[#0d1a1f] px-4 py-3 shadow-[var(--dw-shadow-md)]">
      <div className="flex items-center gap-3">
        <motion.div
          className="relative shrink-0"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-xl bg-[#4a7c92]/40 blur-lg" aria-hidden="true" />
          <img src="/meet-dreams-logo.png" alt="" className="relative size-9 rounded-xl object-contain" draggable={false} />
        </motion.div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">Meet Dreams</h1>
          <p className="text-[11px] text-white/50">Connect · Collaborate · Communicate</p>
        </div>
      </div>
      {unreadCount > 0 && (
        <motion.span
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="size-1.5 rounded-full bg-[#4a7c92]" />
          {unreadCount} unread
        </motion.span>
      )}
    </div>
  )
}
