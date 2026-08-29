import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base canvas gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef5f8] via-[#f3f6f8] to-[#f0f4f7]" />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a8b3 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Ambient color blobs */}
      <motion.div
        className="absolute -left-40 top-10 size-[560px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(74,124,146,0.12) 0%, transparent 70%)' }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 top-1/3 size-[480px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
        animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 size-[400px] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

interface StaggerProps extends HTMLMotionProps<'div'> {
  stagger?: number
  delay?: number
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.05,
  delay = 0.04,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 14 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn('relative z-[1]', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}
