import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ThreeCanvas } from './three-canvas'
import { useThreePerformance } from './use-three-performance'

const BRAND = new THREE.Color('#4A7C92')

// ── Floating dots with soft connections ──────────────────────────────────────
function FloatingDots({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  const { positions, velocities } = useMemo(() => {
    const pos = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 3.5,
      z: (Math.random() - 0.5) * 2,
      ox: 0, oy: 0, // origin
    }))
    pos.forEach((p) => { p.ox = p.x; p.oy = p.y })
    const vel = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.25,
    }))
    return { positions: pos, velocities: vel }
  }, [count])

  const posArray = useMemo(() => {
    const arr = new Float32Array(count * 3)
    positions.forEach((p, i) => {
      arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z
    })
    return arr
  }, [positions, count])

  const geoRef = useRef<THREE.BufferGeometry>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mx = mouse.x * 0.6
    const my = mouse.y * 0.3

    positions.forEach((p, i) => {
      p.x = p.ox + Math.sin(t * velocities[i].x + i) * 0.4 + mx * 0.15
      p.y = p.oy + Math.cos(t * velocities[i].y + i) * 0.25 + my * 0.1
      posArray[i * 3] = p.x
      posArray[i * 3 + 1] = p.y
      posArray[i * 3 + 2] = p.z
    })

    if (geoRef.current) {
      const attr = geoRef.current.attributes.position
      attr.array.set(posArray)
      attr.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute
            args={[posArray, 3]}
            attach="attributes-position"
          />
        </bufferGeometry>
        <pointsMaterial
          color={BRAND}
          size={0.055}
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

// ── Scene content ─────────────────────────────────────────────────────────────
function DashboardContent() {
  const { particles } = useThreePerformance()
  return (
    <>
      <ambientLight intensity={0.1} />
      <FloatingDots count={particles} />
    </>
  )
}

/**
 * Subtle particle layer behind the dashboard hero/greeting area.
 * Very low-key — enhances depth without distracting from content.
 */
export function DashboardParticles3D() {
  return (
    <ThreeCanvas
      className="absolute inset-0 h-full w-full"
      cameraZ={7}
      cameraFov={50}
    >
      <DashboardContent />
    </ThreeCanvas>
  )
}
