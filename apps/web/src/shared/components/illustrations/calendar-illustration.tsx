import { motion } from 'framer-motion'

const EVENTS = [
  { x: 32,  y: 110, w: 76, color: '#4A7C92', label: 'Standup', delay: 0.3 },
  { x: 120, y: 110, w: 88, color: '#2d6a7f', label: 'Design Review', delay: 0.45 },
  { x: 32,  y: 154, w: 50, color: '#6ea8be', label: 'Lunch', delay: 0.55 },
  { x: 94,  y: 154, w: 114, color: '#3a8fa0', label: '1:1 with Omar', delay: 0.65 },
  { x: 32,  y: 198, w: 176, color: '#4A7C92', label: 'HR Strategy Workshop', delay: 0.75 },
]

export function CalendarIllustration() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const hours = ['9am', '10am', '11am', '12pm', '1pm']

  return (
    <svg viewBox="0 0 240 260" className="w-full max-w-[220px]" aria-hidden="true">
      {/* Calendar frame */}
      <motion.rect x="10" y="10" width="220" height="240" rx="14" fill="var(--dw-color-surface-base)"
        stroke="#4A7C92" strokeOpacity="0.2" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />

      {/* Header bar */}
      <motion.rect x="10" y="10" width="220" height="36" rx="14" fill="#4A7C92"
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.1 }} />
      <motion.rect x="10" y="32" width="220" height="14" fill="#4A7C92"
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.1 }} />
      <motion.text x="120" y="33" textAnchor="middle" fontSize="11" fontWeight="700" fill="white"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        July 2026
      </motion.text>

      {/* Day columns */}
      {days.map((d, i) => (
        <motion.text key={d} x={44 + i * 44} y={62} textAnchor="middle" fontSize="9"
          fontWeight="600" fill="#4A7C92" fillOpacity="0.7"
          initial={{ opacity: 0, y: 70 }} animate={{ opacity: 0.7, y: 62 }}
          transition={{ delay: 0.15 + i * 0.05 }}>
          {d}
        </motion.text>
      ))}

      {/* Hour rows */}
      {hours.map((h, i) => (
        <g key={h}>
          <motion.text x="28" y={88 + i * 44} textAnchor="end" fontSize="8"
            fill="#4A7C92" fillOpacity="0.5"
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.2 + i * 0.04 }}>
            {h}
          </motion.text>
          <motion.line x1="32" y1={90 + i * 44} x2="230" y2={90 + i * 44}
            stroke="#4A7C92" strokeOpacity="0.08" strokeWidth="1"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.25 + i * 0.04, duration: 0.4 }}
            style={{ transformOrigin: '32px 0px' }} />
        </g>
      ))}

      {/* Event blocks */}
      {EVENTS.map((ev) => (
        <g key={ev.label}>
          <motion.rect x={ev.x} y={ev.y} width={ev.w} height={34} rx="6"
            fill={ev.color} fillOpacity="0.85"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 0.85, scaleX: 1 }}
            transition={{ delay: ev.delay, duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            style={{ transformOrigin: `${ev.x}px ${ev.y}px` }} />
          <motion.text x={ev.x + 8} y={ev.y + 14} fontSize="8.5" fontWeight="600" fill="white"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ev.delay + 0.2 }}>
            {ev.label}
          </motion.text>
        </g>
      ))}
    </svg>
  )
}
