import { motion } from 'framer-motion'

const COLS = [
  { label: 'To Do', color: '#6ea8be', items: ['Review onboarding docs', 'Update handbook'] },
  { label: 'In Progress', color: '#4A7C92', items: ['Q3 pipeline'] },
  { label: 'Done', color: '#2d6a7f', items: ['Deploy hotfix', 'Set standup'] },
]

export function TasksIllustration() {
  return (
    <svg viewBox="0 0 248 240" className="w-full max-w-[230px]" aria-hidden="true">
      {COLS.map((col, ci) => {
        const x = 8 + ci * 82
        return (
          <g key={col.label}>
            {/* Column header */}
            <motion.rect x={x} y={8} width={76} height={22} rx="7"
              fill={col.color} fillOpacity="0.18"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ci * 0.1 }} />
            <motion.rect x={x + 6} y={15} width={8} height={8} rx="2"
              fill={col.color} fillOpacity="0.9"
              initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: ci * 0.1 + 0.05 }} />
            <motion.text x={x + 20} y={23} fontSize="8.5" fontWeight="700" fill={col.color} fillOpacity="0.85"
              initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: ci * 0.1 + 0.1 }}>
              {col.label}
            </motion.text>

            {/* Cards */}
            {col.items.map((item, ii) => (
              <motion.g key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + ci * 0.12 + ii * 0.1, type: 'spring', stiffness: 260 }}>
                <rect x={x} y={38 + ii * 56} width={76} height={48} rx="8"
                  fill="var(--dw-color-surface-base)"
                  stroke={col.color} strokeOpacity="0.2" strokeWidth="1" />
                {/* Priority dot */}
                <circle cx={x + 10} cy={38 + ii * 56 + 12} r="3.5" fill={col.color} fillOpacity="0.7" />
                {/* Text lines */}
                <rect x={x + 18} y={38 + ii * 56 + 8} width={46} height={7} rx="3"
                  fill={col.color} fillOpacity="0.2" />
                <rect x={x + 18} y={38 + ii * 56 + 18} width={34} height={6} rx="3"
                  fill={col.color} fillOpacity="0.12" />
                {/* Avatar placeholder */}
                <circle cx={x + 60} cy={38 + ii * 56 + 36} r="7"
                  fill={col.color} fillOpacity="0.35" />
                <text x={x + 60} y={38 + ii * 56 + 40} textAnchor="middle"
                  fontSize="6" fontWeight="700" fill={col.color} fillOpacity="0.9">
                  {['BA', 'SM', 'RK'][ci]}
                </text>
              </motion.g>
            ))}
          </g>
        )
      })}

      {/* Floating "3 tasks due today" badge */}
      <motion.rect x="68" y="204" width="112" height="26" rx="13"
        fill="#4A7C92" fillOpacity="0.9"
        initial={{ opacity: 0, y: 214 }} animate={{ opacity: 0.9, y: 204 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 260 }} />
      <motion.text x="124" y="222" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="white"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
        3 tasks due today
      </motion.text>
    </svg>
  )
}
