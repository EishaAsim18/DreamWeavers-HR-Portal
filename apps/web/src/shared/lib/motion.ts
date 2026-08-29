/** DreamWeavers motion presets — subtle, premium, usability-first */

export const EASE = {
  out: [0, 0, 0.2, 1] as const,
  spring: [0.32, 0.72, 0, 1] as const,
}

export const SPRING = {
  snappy: { type: 'spring' as const, stiffness: 500, damping: 32 },
  soft: { type: 'spring' as const, stiffness: 380, damping: 30 },
  gentle: { type: 'spring' as const, stiffness: 260, damping: 26 },
  button: { type: 'spring' as const, stiffness: 600, damping: 28 },
}

export const DURATION = {
  fast: 0.1,
  normal: 0.15,
  slow: 0.22,
  chart: 0.65,
}

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: DURATION.slow, ease: EASE.spring },
}

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.spring },
  },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATION.normal },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: SPRING.soft,
}

export const cardHover = {
  rest: { y: 0, boxShadow: 'var(--dw-shadow-sm)' },
  hover: {
    y: -2,
    boxShadow: 'var(--dw-shadow-md)',
    transition: SPRING.gentle,
  },
}

export const chartReveal = {
  initial: { opacity: 0, pathLength: 0 },
  animate: { opacity: 1, pathLength: 1 },
  transition: { duration: DURATION.chart, ease: EASE.out },
}
