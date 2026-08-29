/**
 * AnimatedBlob — organic morphing SVG blob shape.
 * Good for backgrounds, avatars, and section accents.
 */
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

interface AnimatedBlobProps {
  className?: string
  color?: string
  size?: number
  duration?: number
}

const BLOB_PATHS = [
  'M60,-65C74,-50,79,-28,75,-8C71,12,58,30,43,46C28,62,12,76,-6,77C-24,78,-44,66,-59,49C-74,32,-85,10,-81,-10C-77,-30,-58,-48,-40,-62C-22,-76,-4,-86,14,-83C32,-80,46,-80,60,-65Z',
  'M56,-58C69,-44,74,-22,71,-2C68,18,57,36,42,52C27,68,8,82,-14,82C-36,82,-61,68,-74,48C-87,28,-88,2,-80,-22C-72,-46,-55,-68,-35,-77C-15,-86,8,-82,56,-58Z',
  'M64,-70C78,-54,79,-30,74,-9C69,12,58,30,44,46C30,62,13,76,-7,77C-27,78,-50,66,-65,48C-80,30,-87,6,-82,-17C-77,-40,-60,-62,-40,-73C-20,-84,2,-84,64,-70Z',
  'M55,-62C68,-48,74,-28,72,-9C70,10,60,28,46,44C32,60,14,74,-7,76C-28,78,-52,68,-65,51C-78,34,-80,10,-75,-13C-70,-36,-58,-58,-41,-70C-24,-82,-2,-84,55,-62Z',
]

export function AnimatedBlob({ className, color = '#4A7C92', size = 300, duration = 8 }: AnimatedBlobProps) {
  return (
    <motion.svg
      viewBox="-100 -100 200 200"
      className={cn('', className)}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <motion.path
        d={BLOB_PATHS[0]}
        fill={color}
        animate={{ d: [...BLOB_PATHS, BLOB_PATHS[0]] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}
