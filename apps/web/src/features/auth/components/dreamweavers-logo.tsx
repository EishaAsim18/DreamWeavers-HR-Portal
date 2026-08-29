import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { ANIMATION } from '@/shared/constants'

interface DreamWeaversLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showWordmark?: boolean
}

const iconSizes = { sm: 48, md: 64, lg: 88 }

export function DreamWeaversLogo({
  size = 'md',
  className,
  showWordmark = true,
}: DreamWeaversLogoProps) {
  const iconSize = iconSizes[size]

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: ANIMATION.slow, ease: [0.32, 0.72, 0, 1] }}
        whileHover={{ scale: 1.04 }}
      >
        {/* Ambient glow ring */}
        <motion.div
          className="absolute size-full scale-[1.6] rounded-full bg-[var(--dw-color-brand-primary)]/12 blur-2xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* Actual logo image */}
        <img
          src="/dreamweavers-logo.png"
          alt="DreamWeavers logo"
          width={iconSize}
          height={iconSize}
          className="relative object-contain drop-shadow-md"
          draggable={false}
        />
      </motion.div>

      {/* Wordmark is embedded in the image so hide text duplicate by default */}
      {showWordmark === false && null}
    </div>
  )
}
