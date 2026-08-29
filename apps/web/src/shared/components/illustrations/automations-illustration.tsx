import { motion } from 'framer-motion'

const NODES = [
  { x: 30, y: 110, label: 'Trigger', color: '#4A7C92', icon: '⚡' },
  { x: 110, y: 60,  label: 'Filter',  color: '#2d6a7f', icon: '⚙' },
  { x: 110, y: 160, label: 'Delay',   color: '#6ea8be', icon: '⏱' },
  { x: 192, y: 110, label: 'Action',  color: '#3a8fa0', icon: '✉' },
]

const EDGES = [
  [30, 110, 110, 60],
  [30, 110, 110, 160],
  [110, 60, 192, 110],
  [110, 160, 192, 110],
]

function FlowParticle({ x1, y1, x2, y2, delay }: { x1:number;y1:number;x2:number;y2:number;delay:number }) {
  return (
    <motion.circle r="3.5" fill="#7ab5cc"
      initial={{ offsetDistance: '0%', opacity: 0 }}
      animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 0.9, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, delay, ease: 'easeInOut' }}
      style={{
        offsetPath: `path("M${x1} ${y1} L${x2} ${y2}")`,
      } as React.CSSProperties}
    />
  )
}

export function AutomationsIllustration() {
  return (
    <svg viewBox="0 0 240 230" className="w-full max-w-[220px]" aria-hidden="true">
      {/* Connector lines */}
      {EDGES.map(([x1, y1, x2, y2], i) => (
        <motion.line key={i}
          x1={x1 + 28} y1={y1} x2={x2} y2={y2}
          stroke="#4A7C92" strokeOpacity="0.3" strokeWidth="2"
          strokeDasharray="5 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }} />
      ))}

      {/* Animated flow particles */}
      {EDGES.map(([x1, y1, x2, y2], i) => (
        <FlowParticle key={i} x1={x1 + 28} y1={y1} x2={x2} y2={y2} delay={0.6 + i * 0.35} />
      ))}

      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.g key={n.label}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 280 }}
          style={{ transformOrigin: `${n.x + 28}px ${n.y}px` }}>
          {/* Glow */}
          <circle cx={n.x + 28} cy={n.y} r="28" fill={n.color} fillOpacity="0.08" />
          {/* Node circle */}
          <circle cx={n.x + 28} cy={n.y} r="22" fill={n.color} fillOpacity="0.9" />
          {/* Icon */}
          <text x={n.x + 28} y={n.y + 5} textAnchor="middle" fontSize="14" fill="white">{n.icon}</text>
          {/* Label */}
          <text x={n.x + 28} y={n.y + 36} textAnchor="middle" fontSize="8.5"
            fontWeight="600" fill={n.color} fillOpacity="0.75">{n.label}</text>
        </motion.g>
      ))}

      {/* "5 automations running" badge */}
      <motion.rect x="68" y="204" width="116" height="22" rx="11"
        fill="#4A7C92" fillOpacity="0.12"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
      <motion.circle cx="82" cy="215" r="5" fill="#4A7C92"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }} />
      <motion.text x="170" y="219" textAnchor="end" fontSize="9" fontWeight="600"
        fill="#4A7C92" fillOpacity="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1 }}>
        5 automations live
      </motion.text>
    </svg>
  )
}
