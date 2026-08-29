import { Suspense, useMemo } from 'react'
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  Float,
  Text3D,
} from '@react-three/drei'
import * as THREE from 'three'
import {
  createDWLogoParts,
  DW_CHARCOAL,
  DW_TEAL,
  DW_TEAL_HIGHLIGHT,
  fitLogoParts,
  type DWMaterialType,
} from './dw-logo-geometry'
import { ThreeCanvas } from './three-canvas'
import { useThreePerformance } from './use-three-performance'

const FONT = '/fonts/helvetiker_bold.typeface.json'

const tealSatin = {
  color: DW_TEAL,
  metalness: 0.68,
  roughness: 0.26,
  clearcoat: 0.85,
  clearcoatRoughness: 0.12,
  envMapIntensity: 1.1,
}

const charcoalMatte = {
  color: DW_CHARCOAL,
  metalness: 0.12,
  roughness: 0.78,
  envMapIntensity: 0.35,
}

const pedestalMatte = {
  color: '#1a1a1c',
  metalness: 0.08,
  roughness: 0.82,
  envMapIntensity: 0.25,
}

const weaversSilver = {
  color: '#b8bcc4',
  metalness: 0.72,
  roughness: 0.28,
  clearcoat: 0.4,
  envMapIntensity: 0.9,
}

function LogoPartMesh({ materialType, geometry }: { materialType: DWMaterialType; geometry: THREE.ExtrudeGeometry }) {
  const props = materialType === 'teal-satin' ? tealSatin : charcoalMatte
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial {...props} />
    </mesh>
  )
}

function DWLogoMark() {
  const parts = useMemo(() => fitLogoParts(createDWLogoParts(), 1.08), [])

  return (
    <group>
      {parts.map((part, i) => (
        <LogoPartMesh key={i} {...part} />
      ))}
    </group>
  )
}

function PedestalWordmark() {
  const textProps = {
    font: FONT,
    height: 0.026,
    curveSegments: 8,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.003,
  }

  return (
    <group position={[0, 0, 0.234]}>
      <Center position={[0, 0.28, 0]}>
        <Text3D {...textProps} size={0.102}>
          DREAM
          <meshPhysicalMaterial {...tealSatin} />
        </Text3D>
      </Center>
      <Center position={[0, 0.13, 0]}>
        <Text3D {...textProps} size={0.084} height={0.022}>
          WEAVERS
          <meshPhysicalMaterial {...weaversSilver} />
        </Text3D>
      </Center>
    </group>
  )
}

/** Rectangular award pedestal matching the reference render */
function AwardPedestal() {
  const plateH = 0.055
  const bodyH = 0.34
  const bodyW = 1.22
  const bodyD = 0.46
  const plateW = 1.38
  const plateD = 0.54

  return (
    <group>
      {/* Bottom base plate */}
      <mesh position={[0, plateH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[plateW, plateH, plateD]} />
        <meshPhysicalMaterial {...pedestalMatte} />
      </mesh>

      {/* Teal accent rim on top edge of base plate */}
      {[
        [0, plateD / 2 - 0.004, plateW * 0.97, 0.006, 0.008],
        [0, -(plateD / 2 - 0.004), plateW * 0.97, 0.006, 0.008],
        [plateW / 2 - 0.004, 0, 0.008, 0.006, plateD * 0.88],
        [-(plateW / 2 - 0.004), 0, 0.008, 0.006, plateD * 0.88],
      ].map(([x, z, w, h, d], i) => (
        <mesh key={i} position={[x, plateH + 0.002, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={DW_TEAL_HIGHLIGHT}
            emissive={DW_TEAL}
            emissiveIntensity={0.4}
            metalness={0.65}
            roughness={0.18}
          />
        </mesh>
      ))}

      {/* Main charcoal block */}
      <mesh position={[0, plateH + bodyH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshPhysicalMaterial {...pedestalMatte} />
      </mesh>

      {/* Subtle top lip */}
      <mesh position={[0, plateH + bodyH + 0.004, 0]}>
        <boxGeometry args={[bodyW * 1.02, 0.008, bodyD * 1.02]} />
        <meshPhysicalMaterial color="#2a2a2c" metalness={0.15} roughness={0.7} />
      </mesh>

      <PedestalWordmark />
    </group>
  )
}

function DreamWeaversStatue() {
  const plateH = 0.055
  const bodyH = 0.34
  const logoY = plateH + bodyH + 0.012

  return (
    <Float speed={0.25} floatIntensity={0.015} rotationIntensity={0}>
      <group rotation={[0, 0.38, 0]}>
        <AwardPedestal />
        <group position={[0, logoY, -0.02]}>
          <DWLogoMark />
        </group>
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.5}
          scale={3.4}
          blur={2.8}
          far={3}
          color="#000000"
        />
      </group>
    </Float>
  )
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <hemisphereLight intensity={0.38} color="#f0f4f8" groundColor="#d8d4dc" />
      <directionalLight position={[-3, 5, 4]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} />
      <directionalLight position={[3, 2, 2]} intensity={0.18} color="#c8dce8" />
      <pointLight position={[-1.5, 2.5, 2]} intensity={2.5} color={DW_TEAL_HIGHLIGHT} distance={8} decay={2} />
    </>
  )
}

function BrandSceneContent() {
  return (
    <>
      <StudioLighting />
      <Environment preset="studio" />
      <Bounds fit observe margin={1.45} clip>
        <DreamWeaversStatue />
      </Bounds>
    </>
  )
}

export function LogoFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <img
        src="/dreamweavers-logo.png"
        alt=""
        className="max-h-[85%] max-w-[85%] object-contain drop-shadow-2xl"
        draggable={false}
      />
    </div>
  )
}

export function AuthBrandScene3D({ className }: { className?: string }) {
  const { enabled } = useThreePerformance()
  if (!enabled) return <div className={className}><LogoFallback /></div>

  return (
    <div className={className}>
      <ThreeCanvas className="h-full w-full" cameraFov={38} shadows>
        <BrandSceneContent />
      </ThreeCanvas>
    </div>
  )
}

export function AuthBrandScene3DLazy({ className }: { className?: string }) {
  return (
    <Suspense fallback={<LogoFallback />}>
      <AuthBrandScene3D className={className} />
    </Suspense>
  )
}
