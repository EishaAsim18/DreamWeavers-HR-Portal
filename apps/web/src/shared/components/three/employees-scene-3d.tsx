import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeCanvas } from './three-canvas'
import { useThreePerformance } from './use-three-performance'

const TEAL = new THREE.Color('#4A7C92')
const VIOLET = new THREE.Color('#7c3aed')

/**
 * "Team network" — orbiting people-nodes connected to a glowing core.
 * Mouse-reactive parallax, brand teal + HR violet palette.
 */
function TeamNetwork({ nodeCount }: { nodeCount: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const { mouse } = useThree()

  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => {
        const angle = (i / nodeCount) * Math.PI * 2
        const radius = 2.1 + (i % 3) * 0.55
        return {
          angle,
          radius,
          y: (Math.random() - 0.5) * 1.6,
          speed: 0.1 + Math.random() * 0.12,
          size: 0.055 + Math.random() * 0.05,
          color: i % 3 === 0 ? VIOLET : TEAL,
        }
      }),
    [nodeCount],
  )

  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const linePositions = useMemo(() => new Float32Array(nodeCount * 6), [nodeCount])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06 + mouse.x * 0.25
      groupRef.current.rotation.x = mouse.y * 0.12
    }

    nodes.forEach((node, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      const a = node.angle + t * node.speed
      mesh.position.set(
        Math.cos(a) * node.radius,
        node.y + Math.sin(t * 0.7 + i) * 0.18,
        Math.sin(a) * node.radius,
      )
      // Line from core to node
      linePositions[i * 6] = 0
      linePositions[i * 6 + 1] = 0
      linePositions[i * 6 + 2] = 0
      linePositions[i * 6 + 3] = mesh.position.x
      linePositions[i * 6 + 4] = mesh.position.y
      linePositions[i * 6 + 5] = mesh.position.z
    })

    if (linesRef.current) {
      const attr = linesRef.current.geometry.attributes.position
      ;(attr.array as Float32Array).set(linePositions)
      attr.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Glowing core */}
      <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.4}>
        <mesh>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.7}
            metalness={0.4}
            roughness={0.25}
            wireframe
          />
        </mesh>
        <mesh scale={0.62}>
          <icosahedronGeometry args={[0.42, 2]} />
          <meshStandardMaterial
            color="#7ab5cc"
            emissive={TEAL}
            emissiveIntensity={1.1}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>

      {/* People nodes */}
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el
          }}
        >
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.65}
            metalness={0.3}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute args={[linePositions, 3]} attach="attributes-position" />
        </bufferGeometry>
        <lineBasicMaterial color={TEAL} transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

function EmployeesSceneContent() {
  const { particles, shapes } = useThreePerformance()
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 3, 4]} color="#7ab5cc" intensity={10} distance={14} decay={2} />
      <pointLight position={[-4, -2, 2]} color="#a78bfa" intensity={7} distance={12} decay={2} />

      <TeamNetwork nodeCount={Math.max(8, Math.min(16, shapes * 3))} />

      <Sparkles
        count={particles}
        scale={[12, 6, 6]}
        size={0.8}
        speed={0.25}
        opacity={0.35}
        color="#7ab5cc"
        noise={0.3}
      />
    </>
  )
}

/** Animated 3D team-network layer for the employees hero banner. */
export function EmployeesScene3D() {
  return (
    <ThreeCanvas
      className="absolute inset-0 h-full w-full"
      cameraPosition={[0, 0.4, 6]}
      cameraFov={45}
    >
      <EmployeesSceneContent />
    </ThreeCanvas>
  )
}
