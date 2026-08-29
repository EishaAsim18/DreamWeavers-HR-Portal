import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export type DeviceTier = 'high' | 'medium' | 'low'

/**
 * Detects device capability and reduced-motion preference.
 * Returns a tier that controls particle counts, resolution, and whether
 * 3D scenes are shown at all.
 */
export function useThreePerformance() {
  const prefersReduced = useReducedMotion()
  const [tier, setTier] = useState<DeviceTier>('medium')

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4
    const mobile = /Android|iPhone|iPad/.test(navigator.userAgent)

    if (mobile || cores <= 2 || mem <= 2) {
      setTier('low')
    } else if (cores >= 8 && mem >= 8) {
      setTier('high')
    } else {
      setTier('medium')
    }
  }, [])

  /** Map tier to particle / segment counts */
  const counts: Record<DeviceTier, { particles: number; shapes: number; segments: number }> = {
    high:   { particles: 60, shapes: 5, segments: 32 },
    medium: { particles: 30, shapes: 3, segments: 16 },
    low:    { particles: 12, shapes: 2, segments: 8  },
  }

  const enabled = !prefersReduced && tier !== 'low'

  return {
    tier,
    enabled,
    prefersReduced: Boolean(prefersReduced),
    ...counts[tier],
    /** Pixel-ratio cap: high → 1.5, medium → 1.2, low → 1 */
    dpr: tier === 'high' ? ([1, 1.5] as [number, number])
       : tier === 'medium' ? ([1, 1.2] as [number, number])
       : ([1, 1] as [number, number]),
  }
}
