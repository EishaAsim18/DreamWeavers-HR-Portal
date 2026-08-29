import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '@/shared/lib/utils'

interface AnimatedAreaChartProps {
  data: { label: string; value: number }[]
  className?: string
  height?: number
}

export function AnimatedAreaChart({ data, className, height = 220 }: AnimatedAreaChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: mounted ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="brandArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--dw-color-brand-primary)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--dw-color-brand-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dw-color-border-default)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--dw-color-ink-tertiary)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--dw-color-ink-tertiary)' }}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--dw-color-surface-base)',
              border: '1px solid var(--dw-color-border-default)',
              borderRadius: 8,
              fontSize: 12,
              boxShadow: 'var(--dw-shadow-md)',
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--dw-color-brand-primary)"
            strokeWidth={2}
            fill="url(#brandArea)"
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
