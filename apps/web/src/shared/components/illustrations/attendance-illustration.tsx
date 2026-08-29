import { motion } from 'framer-motion'

const ROWS = [
  { name: 'Ayesha S.', days: [1,1,1,1,1,0,0], status: 'Present' },
  { name: 'Omar F.',   days: [1,1,0,1,1,0,0], status: 'Leave' },
  { name: 'Zara M.',   days: [1,1,1,1,1,0,0], status: 'Present' },
  { name: 'Bilal A.',  days: [1,0,1,1,1,0,0], status: 'Late' },
]

const STATUS_COLOR: Record<string, string> = {
  Present: '#22c55e',
  Leave:   '#f59e0b',
  Late:    '#f97316',
}

export function AttendanceIllustration() {
  const days = ['M','T','W','T','F','S','S']

  return (
    <svg viewBox="0 0 240 220" className="w-full max-w-[220px]" aria-hidden="true">
      {/* Card */}
      <motion.rect x="8" y="8" width="224" height="204" rx="14"
        fill="var(--dw-color-surface-base)" stroke="#4A7C92" strokeOpacity="0.15" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} />

      {/* Header */}
      <motion.rect x="8" y="8" width="224" height="34" rx="14" fill="#4A7C92" fillOpacity="0.08"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      <motion.rect x="8" y="28" width="224" height="14" fill="#4A7C92" fillOpacity="0.08"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      <motion.text x="24" y="30" fontSize="10" fontWeight="700" fill="#4A7C92"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        This week
      </motion.text>

      {/* Day headers */}
      {days.map((d, i) => (
        <motion.text key={d + i} x={100 + i * 22} y={55} textAnchor="middle"
          fontSize="8.5" fontWeight="600" fill="#4A7C92" fillOpacity="0.55"
          initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 0.15 + i * 0.04 }}>
          {d}
        </motion.text>
      ))}

      {/* Rows */}
      {ROWS.map((row, ri) => (
        <g key={row.name}>
          {/* Avatar */}
          <motion.circle cx="28" cy={78 + ri * 36} r="12" fill="#4A7C92" fillOpacity={0.15 + ri * 0.06}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.25 + ri * 0.08, type: 'spring', stiffness: 260 }}
            style={{ transformOrigin: `28px ${78 + ri * 36}px` }} />
          <motion.text x="28" y={82 + ri * 36} textAnchor="middle" fontSize="7.5" fontWeight="700"
            fill="#4A7C92" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + ri * 0.08 }}>
            {row.name.split(' ').map(n => n[0]).join('')}
          </motion.text>

          {/* Name */}
          <motion.text x="50" y={82 + ri * 36} fontSize="9" fontWeight="600"
            fill="var(--dw-color-ink-primary)"
            initial={{ opacity: 0, x: 44 }} animate={{ opacity: 0.8, x: 50 }}
            transition={{ delay: 0.3 + ri * 0.08 }}>
            {row.name}
          </motion.text>

          {/* Day cells */}
          {row.days.map((present, di) => (
            <motion.rect key={di}
              x={91 + di * 22} y={66 + ri * 36} width="14" height="14" rx="4"
              fill={present ? STATUS_COLOR[row.status] : '#4A7C92'}
              fillOpacity={present ? 0.85 : 0.1}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.4 + ri * 0.07 + di * 0.04, type: 'spring', stiffness: 320 }}
              style={{ transformOrigin: `${98 + di * 22}px ${73 + ri * 36}px` }} />
          ))}

          {/* Status pill */}
          <motion.rect x="206" y={68 + ri * 36} width="24" height="14" rx="7"
            fill={STATUS_COLOR[row.status]} fillOpacity="0.18"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + ri * 0.08 }} />
          <motion.text x="218" y={79 + ri * 36} textAnchor="middle" fontSize="7.5"
            fontWeight="700" fill={STATUS_COLOR[row.status]}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 + ri * 0.08 }}>
            {row.status.slice(0, 2).toUpperCase()}
          </motion.text>
        </g>
      ))}

      {/* Footer stat */}
      <motion.text x="120" y="205" textAnchor="middle" fontSize="9.5" fontWeight="600"
        fill="#4A7C92" fillOpacity="0.65"
        initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: 1 }}>
        94% team attendance this week
      </motion.text>
    </svg>
  )
}
