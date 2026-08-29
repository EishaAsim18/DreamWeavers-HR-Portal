import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { useThreePerformance } from './use-three-performance'

interface ThreeCanvasProps {
  children: React.ReactNode
  className?: string
  /** Camera Z distance */
  cameraZ?: number
  cameraFov?: number
  /** Optional full camera position override */
  cameraPosition?: [number, number, number]
  shadows?: boolean
}

/**
 * Base Canvas wrapper — lazy-loaded, performance-adaptive, respects
 * reduced-motion (returns null when user prefers no motion).
 */
export function ThreeCanvas({
  children,
  className,
  cameraZ = 5,
  cameraFov = 60,
  cameraPosition,
  shadows = false,
}: ThreeCanvasProps) {
  const { enabled, dpr } = useThreePerformance()
  const [degraded, setDegraded] = useState(false)

  if (!enabled) return null

  return (
    <Canvas
      className={cn('pointer-events-none', className)}
      dpr={degraded ? [1, 1] : dpr}
      shadows={shadows}
      camera={{ position: cameraPosition ?? [0, 0, cameraZ], fov: cameraFov }}
      gl={{
        antialias: !degraded,
        alpha: true,
        powerPreference: 'default',
        stencil: false,
        depth: true,
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        threshold={0.9}
        onDecline={() => setDegraded(true)}
      />
      {!degraded && <AdaptiveDpr pixelated />}
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
