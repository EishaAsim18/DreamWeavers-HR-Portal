import { Suspense, lazy } from 'react'
import { AuroraBackground } from '@/shared/components/effects/aurora-background'
import { GridBackground } from '@/shared/components/effects/animated-grid'
import { Meteors } from '@/shared/components/effects/meteors'

const LoginScene3D = lazy(() =>
  import('@/shared/components/three/login-scene-3d').then((m) => ({ default: m.LoginScene3D })),
)

/**
 * Auth page background — lavender gradient + Aurora + Dot grid + Meteors + soft 3D orbs.
 */
export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient — soft sky blue / teal */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ddedf2] via-[var(--dw-color-surface-canvas)] to-[var(--dw-color-brand-primary-subtle)]
        dark:from-[#060e14] dark:via-[var(--dw-color-surface-canvas)] dark:to-[#081318]" />

      {/* Secondary color burst top-left */}
      <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-[var(--dw-color-brand-primary)]/8 blur-3xl" />

      {/* Blue burst bottom-right */}
      <div className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-[#6bafcc]/10 blur-3xl" />

      {/* Aurora blobs */}
      <AuroraBackground intensity="subtle" />

      {/* Dot grid */}
      <GridBackground variant="dots" size={28} fade />

      {/* Meteors — subtle shooting stars */}
      <Meteors number={8} />

      {/* 3D scene — lazy loaded */}
      <Suspense fallback={null}>
        <LoginScene3D />
      </Suspense>
    </div>
  )
}
