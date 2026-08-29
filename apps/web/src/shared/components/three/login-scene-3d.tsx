import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeCanvas } from './three-canvas'
import { useThreePerformance } from './use-three-performance'

const TEAL   = new THREE.Color('#4A7C92')
const TEAL_L = new THREE.Color('#7ab5cc')
const BLUE_L = new THREE.Color('#6bafcc')

function GlowOrb({
  position,
  scale,
  color,
  speed = 1,
}: {
  position: [number, number, number]
  scale: number
  color: string
  speed?: number
}) {
  return (
    <Float speed={speed} floatIntensity={0.6} rotationIntensity={0}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 24, 24]} />
        <MeshDistortMaterial
          color={color}
          speed={1.5}
          distort={0.28}
          radius={1}
          transparent
          opacity={0.22}
          roughness={0}
          metalness={0.1}
        />
      </mesh>
    </Float>
  )
}

function DriftingLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.getElapsedTime()
    lightRef.current.position.set(
      Math.sin(t * 0.3) * 4,
      Math.cos(t * 0.22) * 3,
      2 + Math.sin(t * 0.18) * 1.5,
    )
  })
  return <pointLight ref={lightRef} color={TEAL_L} intensity={14} distance={16} decay={2} />
}

function BlueDriftLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.getElapsedTime() + 3
    lightRef.current.position.set(
      Math.cos(t * 0.2) * 5,
      Math.sin(t * 0.15) * 4,
      -1 + Math.cos(t * 0.12) * 2,
    )
  })
  return <pointLight ref={lightRef} color={BLUE_L} intensity={10} distance={14} decay={2} />
}

function ParticleNetwork({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }
    return { positions: pos }
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.012
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        color={TEAL}
        size={0.038}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function LoginSceneContent() {
  const { shapes, particles } = useThreePerformance()

  const orbConfigs = [
    { position: [-2.5, 3.0, -4.0] as [number, number, number], scale: 1.8, color: '#3d6779', speed: 0.5 },
    { position: [4.0, -2.5, -5.0] as [number, number, number], scale: 2.2, color: '#4a7c92', speed: 0.4 },
    { position: [0.0,  1.5, -6.0] as [number, number, number], scale: 3.0, color: '#6bafcc', speed: 0.3 },
  ]

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 8, 5]} intensity={0.35} color="#ffffff" />
      <DriftingLight />
      <BlueDriftLight />
      <pointLight position={[-5, -4, 2]} color={TEAL} intensity={8} distance={12} decay={2} />
      <pointLight position={[6, 2, -3]} color={TEAL_L} intensity={6} distance={10} decay={2} />

      {orbConfigs.slice(0, Math.ceil(shapes / 2)).map((cfg, i) => (
        <GlowOrb key={`o${i}`} {...cfg} />
      ))}

      <Sparkles
        count={particles}
        scale={[16, 11, 6]}
        size={0.75}
        speed={0.22}
        opacity={0.3}
        color={TEAL_L}
        noise={0.3}
      />

      <Sparkles
        count={Math.round(particles * 0.4)}
        scale={[14, 10, 5]}
        size={0.65}
        speed={0.18}
        opacity={0.22}
        color="#6bafcc"
        noise={0.4}
      />

      <ParticleNetwork count={Math.round(particles * 0.55)} />
    </>
  )
}

/** Full-screen soft ambient background for auth pages — orbs, sparkles, no crystal shapes. */
export function LoginScene3D() {
  return (
    <ThreeCanvas
      className="absolute inset-0 h-full w-full"
      cameraZ={6}
      cameraFov={55}
    >
      <LoginSceneContent />
    </ThreeCanvas>
  )
}
