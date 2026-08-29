import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeCanvas } from './three-canvas'
import { useThreePerformance } from './use-three-performance'

const BRAND = new THREE.Color('#4A7C92')
const BRAND_LIGHT = new THREE.Color('#7ab5cc')

// ── Central DW emblem as 3D geometry ─────────────────────────────────────────
function DWEmblem() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (outerRef.current) outerRef.current.rotation.y = t * 0.5
    if (innerRef.current) innerRef.current.rotation.y = -t * 0.75
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.4
      coreRef.current.rotation.z = t * 0.3
      const pulse = 1 + Math.sin(t * 2) * 0.04
      coreRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <Float speed={0.6} floatIntensity={0.3} rotationIntensity={0.08}>
      <group>
        {/* Outer ring */}
        <mesh ref={outerRef}>
          <torusGeometry args={[1.4, 0.05, 12, 80]} />
          <meshPhysicalMaterial
            color={BRAND}
            metalness={0.4}
            roughness={0.1}
            transparent
            opacity={0.7}
            emissive={BRAND}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Inner ring */}
        <mesh ref={innerRef}>
          <torusGeometry args={[0.9, 0.035, 10, 60]} />
          <meshPhysicalMaterial
            color={BRAND_LIGHT}
            metalness={0.5}
            roughness={0.05}
            transparent
            opacity={0.6}
            emissive={BRAND_LIGHT}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Core icosahedron — glass */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.55, 1]} />
          <MeshTransmissionMaterial
            color={BRAND}
            transmission={0.9}
            roughness={0.0}
            thickness={0.4}
            chromaticAberration={0.03}
            ior={1.5}
            backside
            samples={4}
            envMapIntensity={1.5}
            transparent
            opacity={0.88}
          />
        </mesh>
      </group>
    </Float>
  )
}

// ── Orbiting dots ─────────────────────────────────────────────────────────────
function OrbitDots() {
  const count = 8
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.6
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              color={BRAND_LIGHT}
              transparent
              opacity={0.3 + (i % 3) * 0.25}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ── Scene content ─────────────────────────────────────────────────────────────
function LoadingContent() {
  const { particles } = useThreePerformance()

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 4, 3]} color={BRAND_LIGHT} intensity={20} distance={20} decay={2} />
      <pointLight position={[-3, -2, 2]} color={BRAND} intensity={10} distance={15} decay={2} />

      <DWEmblem />
      <OrbitDots />

      <Sparkles
        count={Math.floor(particles * 0.5)}
        scale={[5, 5, 4]}
        size={0.6}
        speed={0.4}
        opacity={0.3}
        color={BRAND_LIGHT}
        noise={0.5}
      />
    </>
  )
}

/**
 * 3D loading animation — sits behind the loading screen text.
 */
export function LoadingScene3D() {
  return (
    <ThreeCanvas
      className="absolute inset-0 h-full w-full"
      cameraZ={5}
      cameraFov={58}
    >
      <LoadingContent />
    </ThreeCanvas>
  )
}
