import { motion, AnimatePresence } from 'framer-motion'
import { useLoading } from '@/shared/hooks'

export function TopProgressBar() {
  const { isNavigating, isGlobalLoading } = useLoading()
  const active = isNavigating || isGlobalLoading

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed left-0 right-0 top-0 z-[calc(var(--dw-z-sticky)+1)] h-0.5 origin-left bg-[var(--dw-color-brand-primary)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.85 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="progressbar"
          aria-label="Loading"
        />
      )}
    </AnimatePresence>
  )
}
