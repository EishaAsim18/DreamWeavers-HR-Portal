import { motion } from 'framer-motion'

export function EmployeesIllustration() {
  const nodes = [
    { cx: 120, cy: 60, r: 22, label: 'AY', color: '#4A7C92', delay: 0 },
    { cx: 60,  cy: 148, r: 18, label: 'OF', color: '#2d6a7f', delay: 0.1 },
    { cx: 180, cy: 148, r: 18, label: 'ZM', color: '#6ea8be', delay: 0.2 },
    { cx: 28,  cy: 240, r: 15, label: 'BA', color: '#3a8fa0', delay: 0.3 },
    { cx: 100, cy: 248, r: 15, label: 'SM', color: '#5b9cb0', delay: 0.35 },
    { cx: 210, cy: 240, r: 15, label: 'RK', color: '#4A7C92', delay: 0.4 },
  ]
  const links = [
    [120, 60, 60, 148], [120, 60, 180, 148],
    [60, 148, 28, 240], [60, 148, 100, 248],
    [180, 148, 210, 240],
  ]

  return (
    <svg viewBox="0 0 240 280" className="w-full max-w-[220px]" aria-hidden="true">
      {/* Connection lines */}
      {links.map(([x1, y1, x2, y2], i) => (
        <motion.line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#4A7C92"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.35 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.label}>
          <motion.circle
            cx={n.cx} cy={n.cy} r={n.r + 6}
            fill={n.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.12 }}
            transition={{ delay: n.delay + 0.3, duration: 0.4 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          />
          <motion.circle
            cx={n.cx} cy={n.cy} r={n.r}
            fill={n.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: n.delay, duration: 0.35, type: 'spring', stiffness: 280 }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          />
          <motion.text
            x={n.cx} y={n.cy + 4}
            textAnchor="middle"
            fontSize={n.r * 0.72}
            fontWeight="700"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: n.delay + 0.2 }}
          >
            {n.label}
          </motion.text>
        </g>
      ))}
      {/* Floating +5 badge */}
      <motion.rect x="192" y="4" width="44" height="20" rx="10" fill="#4A7C92" opacity="0.9"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 0.9, y: 0 }} transition={{ delay: 0.8 }} />
      <motion.text x="214" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill="white"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        +242
      </motion.text>
    </svg>
  )
}
