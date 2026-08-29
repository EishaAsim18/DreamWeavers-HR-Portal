import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { AmbientBackground } from '@/shared/components/motion'
import { APP_NAME } from '@/shared/constants'

const LoadingScene3D = lazy(() =>
  import('@/shared/components/three/loading-scene-3d').then((m) => ({ default: m.LoadingScene3D })),
)

export function LoadingScreen() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      {/* CSS ambient layer */}
      <AmbientBackground />

      {/* 3D layer behind the logo text */}
      <Suspense fallback={null}>
        <LoadingScene3D />
      </Suspense>

      {/* Foreground logo + text */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo image */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/dreamweavers-logo.png"
            alt="DreamWeavers"
            className="size-16 object-contain drop-shadow-lg"
            draggable={false}
          />
          {/* Pulse ring */}
          <motion.span
            className="absolute inset-0 rounded-2xl ring-2 ring-[var(--dw-color-brand-primary)]/30"
            animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.p
          className="text-sm text-[var(--dw-color-ink-tertiary)]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading {APP_NAME}…
        </motion.p>

        <span className="sr-only">Loading application</span>
      </motion.div>
    </div>
  )
}
