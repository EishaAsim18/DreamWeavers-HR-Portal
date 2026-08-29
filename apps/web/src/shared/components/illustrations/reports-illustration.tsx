import { motion } from 'framer-motion'

const BARS = [
  { h: 62, color: '#6ea8be' },
  { h: 88, color: '#4A7C92' },
  { h: 55, color: '#6ea8be' },
  { h: 104, color: '#4A7C92' },
  { h: 72, color: '#6ea8be' },
  { h: 118, color: '#2d6a7f' },
  { h: 84, color: '#4A7C92' },
]

const LINE_POINTS = '28,156 60,138 92,148 124,120 156,132 188,108 220,116'

export function ReportsIllustration() {
  return (
    <svg viewBox="0 0 248 230" className="w-full max-w-[230px]" aria-hidden="true">
      {/* Background card */}
      <motion.rect x="8" y="8" width="232" height="214" rx="14"
        fill="var(--dw-color-surface-base)" stroke="#4A7C92" strokeOpacity="0.15" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />

      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <motion.line key={i} x1="28" y1={50 + i * 36} x2="226" y2={50 + i * 36}
          stroke="#4A7C92" strokeOpacity="0.07" strokeWidth="1"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
          style={{ transformOrigin: '28px 0px' }} />
      ))}

      {/* Bars */}
      {BARS.map((bar, i) => (
        <motion.rect
          key={i}
          x={28 + i * 28} y={178 - bar.h}
          width={18} height={bar.h}
          rx="5"
          fill={bar.color} fillOpacity="0.85"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.85 }}
          transition={{ delay: 0.25 + i * 0.07, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          style={{ transformOrigin: `${28 + i * 28}px 178px` }}
        />
      ))}

      {/* Trend line */}
      <motion.polyline
        points={LINE_POINTS}
        fill="none"
        stroke="#4A7C92"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        strokeDashoffset="200"
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
      />

      {/* Data point dots on trend */}
      {LINE_POINTS.split(' ').map((pt, i) => {
        const [px, py] = pt.split(',').map(Number)
        return (
          <motion.circle key={i} cx={px} cy={py} r="4"
            fill="white" stroke="#4A7C92" strokeWidth="2"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 1.0 + i * 0.07, type: 'spring', stiffness: 400 }}
            style={{ transformOrigin: `${px}px ${py}px` }} />
        )
      })}

      {/* X labels */}
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
        <motion.text key={i} x={37 + i * 28} y="198" textAnchor="middle" fontSize="9"
          fill="#4A7C92" fillOpacity="0.5"
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.2 + i * 0.04 }}>
          {d}
        </motion.text>
      ))}

      {/* Stat badge */}
      <motion.rect x="160" y="16" width="76" height="28" rx="8"
        fill="#4A7C92" fillOpacity="0.12"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      <motion.text x="198" y="25" textAnchor="middle" fontSize="8" fill="#4A7C92" fillOpacity="0.6"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.9 }}>
        Attendance rate
      </motion.text>
      <motion.text x="198" y="38" textAnchor="middle" fontSize="11" fontWeight="800" fill="#4A7C92"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        94%
      </motion.text>
    </svg>
  )
}
