import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Video } from 'lucide-react'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import { useCall } from '../contexts/call-context'

export function IncomingCallBanner() {
  const { phase, incomingCall, acceptCall, declineCall } = useCall()

  const person = incomingCall ? getPerson(incomingCall.peerUserId) : undefined
  const isOpen = phase === 'ringing' && !!incomingCall

  return (
    <AnimatePresence>
      {isOpen && incomingCall && (
        <motion.div
          className="fixed left-1/2 top-4 z-[70] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-xl)]"
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <div className="h-1 w-full bg-gradient-to-r from-[#4a7c92] via-[#7c3aed] to-[#4a7c92]" />
          <div className="flex items-center gap-3 px-4 py-3.5">
            <motion.span
              className="relative flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: person?.avatarColor ?? '#4a7c92' }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-current opacity-20" />
              {person?.initials ?? '?'}
            </motion.span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[var(--dw-color-ink-primary)]">
                {person?.name ?? 'Unknown caller'}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-[var(--dw-color-ink-tertiary)]">
                {incomingCall.kind === 'video' ? <Video className="size-3" /> : <Phone className="size-3" />}
                Incoming {incomingCall.kind} call…
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <motion.button
                onClick={declineCall}
                className="flex size-9 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                whileTap={{ scale: 0.92 }}
                aria-label="Decline"
              >
                <PhoneOff className="size-4" />
              </motion.button>
              <motion.button
                onClick={() => void acceptCall()}
                className="flex size-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition-colors hover:bg-emerald-600"
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                aria-label="Accept"
              >
                <Phone className="size-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
