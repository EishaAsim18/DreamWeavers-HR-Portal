import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, MeshTransmissionMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeCanvas } from './three-canvas'
import { useThreePerformance } from './use-three-performance'

const TEAL = new THREE.Color('#4A7C92')
const TEAL_LIGHT = new THREE.Color('#7ab5cc')
const DARK = new THREE.Color('#1A1A1B')

// ── Orbiting communication spheres ───────────────────────────────────────────
interface OrbitProps {
  radius: number
  speed: number
  size: number
  offset: number
  color: THREE.Color
}

function OrbitingSphere({ radius, speed, size, offset, color }: OrbitProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * speed + offset
    meshRef.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * radius * 0.4, Math.sin(t) * radius * 0.5)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.1}
        roughness={0.05}
        transmission={0.85}
        thickness={0.5}
        transparent
        opacity={0.75}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

// ── Particle stream (communication flow) ─────────────────────────────────────
function CommunicationStream({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const pos = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.04
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[pos, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        color={TEAL_LIGHT}
        size={0.045}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ── Central glass ring ────────────────────────────────────────────────────────
function GlassRing() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    ringRef.current.rotation.z = clock.getElapsedTime() * 0.18
    ringRef.current.rotation.x = Math.PI / 4 + Math.sin(clock.getElapsedTime() * 0.15) * 0.1
  })

  return (
    <Float speed={0.5} floatIntensity={0.3} rotationIntensity={0.1}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.06, 16, 80]} />
        <MeshTransmissionMaterial
          color={TEAL}
          transmission={0.9}
          roughness={0.0}
          thickness={0.15}
          chromaticAberration={0.03}
          ior={1.6}
          envMapIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  )
}

// ── Outer decorative ring ─────────────────────────────────────────────────────
function OuterRing() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    ringRef.current.rotation.z = -clock.getElapsedTime() * 0.09
    ringRef.current.rotation.x = Math.PI / 3
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.8, 0.03, 8, 100]} />
      <meshBasicMaterial color={TEAL_LIGHT} transparent opacity={0.25} />
    </mesh>
  )
}

// ── Central MD mark (abstract geometry approximation) ─────────────────────────
function MDMark() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.12
  })

  return (
    <Float speed={0.4} floatIntensity={0.25} rotationIntensity={0.05}>
      <group ref={groupRef}>
        {/* M shape as two tall boxes */}
        <mesh position={[-0.55, 0, 0]}>
          <boxGeometry args={[0.14, 1.1, 0.12]} />
          <meshPhysicalMaterial color={TEAL} metalness={0.3} roughness={0.15} transmission={0.5} thickness={0.2} envMapIntensity={1} />
        </mesh>
        <mesh position={[-0.18, -0.18, 0]} rotation={[0, 0, Math.PI / 5.5]}>
          <boxGeometry args={[0.12, 0.72, 0.12]} />
          <meshPhysicalMaterial color={TEAL_LIGHT} metalness={0.3} roughness={0.1} transmission={0.6} thickness={0.2} envMapIntensity={1} />
        </mesh>
        <mesh position={[0.18, -0.18, 0]} rotation={[0, 0, -Math.PI / 5.5]}>
          <boxGeometry args={[0.12, 0.72, 0.12]} />
          <meshPhysicalMaterial color={TEAL_LIGHT} metalness={0.3} roughness={0.1} transmission={0.6} thickness={0.2} envMapIntensity={1} />
        </mesh>
        {/* D shape approximation: a wide curved box */}
        <mesh position={[0.7, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 1.1, 16, 1, false, -Math.PI / 2, Math.PI]} />
          <MeshTransmissionMaterial
            color={DARK}
            transmission={0.6}
            roughness={0.0}
            thickness={0.3}
            ior={1.4}
            chromaticAberration={0.01}
            envMapIntensity={1.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Chat bubble dots */}
        {[-0.22, 0, 0.22].map((x, i) => (
          <mesh key={i} position={[0.7 + x * 0.15, 0, 0.35]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// ── Full scene ────────────────────────────────────────────────────────────────
function MeetDreamsContent() {
  const { particles, shapes } = useThreePerformance()

  return (
    <>
      <ambientLight intensity={0.2} color="#c8e0eb" />
      <directionalLight position={[4, 6, 4]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} color={TEAL_LIGHT} intensity={15} distance={18} decay={2} />
      <pointLight position={[4, -2, 2]} color={DARK} intensity={6} distance={14} decay={2} />

      <Environment preset="night" />

      {/* Central MD mark */}
      <MDMark />

      {/* Rings */}
      <GlassRing />
      {shapes >= 3 && <OuterRing />}

      {/* Orbiting spheres */}
      <OrbitingSphere radius={2.6} speed={0.35} size={0.15} offset={0}         color={TEAL} />
      <OrbitingSphere radius={2.6} speed={0.35} size={0.12} offset={Math.PI}   color={TEAL_LIGHT} />
      <OrbitingSphere radius={2.6} speed={0.35} size={0.10} offset={Math.PI/2} color={TEAL} />

      {/* Sparkles */}
      <Sparkles
        count={particles}
        scale={[12, 8, 5]}
        size={0.7}
        speed={0.3}
        opacity={0.45}
        color={TEAL_LIGHT}
        noise={0.4}
      />

      {/* Communication stream */}
      <CommunicationStream count={particles} />
    </>
  )
}

/**
 * Immersive 3D scene for the Meet Dreams module.
 * Matches the MD logo palette (teal + dark navy).
 */
export function MeetDreamsScene3D() {
  return (
    <ThreeCanvas
      className="absolute inset-0 h-full w-full"
      cameraZ={7}
      cameraFov={52}
    >
      <MeetDreamsContent />
    </ThreeCanvas>
  )
}
