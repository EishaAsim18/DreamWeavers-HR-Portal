import { motion } from 'framer-motion'

const ROLES = [
  { label: 'Super Admin', color: '#ef4444', y: 40, badge: '1' },
  { label: 'Admin',       color: '#4A7C92', y: 110, badge: '3' },
  { label: 'Employee',    color: '#6ea8be', y: 180, badge: '247' },
]

export function AdminManagementIllustration() {
  return (
    <svg viewBox="0 0 220 240" className="w-full max-w-[200px]" aria-hidden="true">
      {/* Pyramid shape */}
      <motion.polygon points="110,12 30,90 190,90" fill="#ef4444" fillOpacity="0.08"
        stroke="#ef4444" strokeOpacity="0.25" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      <motion.polygon points="30,100 10,178 210,178" fill="#4A7C92" fillOpacity="0.07"
        stroke="#4A7C92" strokeOpacity="0.2" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.polygon points="10,188 0,240 220,240" fill="#6ea8be" fillOpacity="0.06"
        stroke="#6ea8be" strokeOpacity="0.15" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />

      {/* Role rows */}
      {ROLES.map((r, i) => (
        <g key={r.label}>
          {/* Role pill */}
          <motion.rect x={i === 0 ? 70 : i === 1 ? 44 : 18} y={r.y} width={i === 0 ? 80 : i === 1 ? 132 : 184} height={24} rx="12"
            fill={r.color} fillOpacity="0.12"
            stroke={r.color} strokeOpacity="0.3" strokeWidth="1"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            style={{ transformOrigin: '110px 0px' }} />

          {/* Shield icon approximate */}
          <motion.circle cx={i === 0 ? 88 : i === 1 ? 62 : 36} cy={r.y + 12} r="7"
            fill={r.color} fillOpacity="0.8"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 300 }}
            style={{ transformOrigin: `${i === 0 ? 88 : i === 1 ? 62 : 36}px ${r.y + 12}px` }} />

          <motion.text
            x={i === 0 ? 88 : i === 1 ? 62 : 36} y={r.y + 16}
            textAnchor="middle" fontSize="7" fontWeight="700" fill="white"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.12 }}>
            {i === 0 ? '★' : i === 1 ? 'A' : 'E'}
          </motion.text>

          {/* Label */}
          <motion.text
            x={i === 0 ? 102 : i === 1 ? 76 : 50} y={r.y + 15}
            fontSize="9.5" fontWeight="700" fill={r.color}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.12 }}>
            {r.label}
          </motion.text>

          {/* Count badge */}
          <motion.text
            x={i === 0 ? 142 : i === 1 ? 168 : 196} y={r.y + 15}
            fontSize="8.5" fontWeight="600" fill={r.color} fillOpacity="0.6"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.6 + i * 0.12 }}>
            ×{r.badge}
          </motion.text>
        </g>
      ))}

      {/* Lock badge at top */}
      <motion.rect x="88" y="2" width="44" height="18" rx="9"
        fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeOpacity="0.4" strokeWidth="1"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 2 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 240 }} />
      <motion.text x="110" y="15" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ef4444"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
        🔒 Seed only
      </motion.text>
    </svg>
  )
}
