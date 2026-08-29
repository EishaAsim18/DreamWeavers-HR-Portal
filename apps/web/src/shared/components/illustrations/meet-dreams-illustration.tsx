import { motion } from 'framer-motion'

export function MeetDreamsIllustration() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* MD Logo — uploaded brand asset */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 240 }}
      >
        <motion.div
          className="absolute inset-0 rounded-3xl bg-[#4A7C92]/20 blur-2xl"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <img
          src="/meet-dreams-logo.png"
          alt="Meet Dreams"
          className="relative size-28 rounded-2xl object-contain drop-shadow-xl"
          draggable={false}
        />
      </motion.div>

      {/* Chat bubbles */}
      <div className="w-[240px] space-y-2">
        {[
          { msg: 'Subah bakhair! 🌙', side: 'left',  delay: 0.4 },
          { msg: 'Sprint review at 2pm', side: 'right', delay: 0.6 },
          { msg: 'Slides ready, sharing now', side: 'left', delay: 0.8 },
          { msg: '✅ Saw it — looks great!', side: 'right', delay: 1.0 },
        ].map(({ msg, side, delay }) => (
          <motion.div
            key={msg}
            className={`flex ${side === 'right' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, x: side === 'right' ? 16 : -16, y: 6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay, duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <span
              className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs font-medium shadow-sm ${
                side === 'right'
                  ? 'rounded-br-md bg-[#4A7C92] text-white'
                  : 'rounded-bl-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] text-[var(--dw-color-ink-primary)]'
              }`}
            >
              {msg}
            </span>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 py-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full bg-[#4A7C92]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        </motion.div>
      </div>
    </div>
  )
}
