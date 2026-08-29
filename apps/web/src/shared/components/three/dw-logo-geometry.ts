import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'

export const DW_TEAL = '#4A768A'
export const DW_TEAL_HIGHLIGHT = '#6BA3B8'
export const DW_CHARCOAL = '#231F20'

/** Official logo mark — traced SVG paths (D-frame + W legs) */
export const DW_LOGO_MARK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 74">
  <path fill-rule="evenodd" fill="${DW_TEAL}" d="
    M 9.5 5.5 L 9.5 50.5 Q 31 63.5 31 63.5 L 46.5 50.5 L 46.5 5.5 Z
    M 30.5 20.5 L 22.5 44.5 L 38.5 44.5 Z
  "/>
  <path fill="${DW_CHARCOAL}" d="M 46.5 5.5 L 57 5.5 L 68.5 18.5 L 54 63.5 L 41 51 Z"/>
  <path fill="${DW_CHARCOAL}" d="M 68.5 18.5 L 82.5 5.5 L 90.5 63.5 L 54.5 63.5 Z"/>
</svg>
`

export const DW_EXTRUDE = {
  depth: 0.32,
  bevelEnabled: true,
  bevelThickness: 0.034,
  bevelSize: 0.026,
  bevelSegments: 5,
  curveSegments: 20,
} satisfies THREE.ExtrudeGeometryOptions

export type DWMaterialType = 'teal-satin' | 'charcoal-matte'

export interface DWLogoPart {
  geometry: THREE.ExtrudeGeometry
  materialType: DWMaterialType
}

export function createDWLogoParts(): DWLogoPart[] {
  const loader = new SVGLoader()
  const { paths } = loader.parse(DW_LOGO_MARK_SVG)
  const parts: DWLogoPart[] = []

  for (const path of paths) {
    const isTeal = path.color.getHexString().toLowerCase() === '4a768a'
    for (const shape of SVGLoader.createShapes(path)) {
      parts.push({
        geometry: new THREE.ExtrudeGeometry(shape, DW_EXTRUDE),
        materialType: isTeal ? 'teal-satin' : 'charcoal-matte',
      })
    }
  }

  return parts
}

export function fitLogoParts(parts: DWLogoPart[], targetHeight = 1.05): DWLogoPart[] {
  const temp = new THREE.Group()
  for (const { geometry } of parts) temp.add(new THREE.Mesh(geometry))
  temp.scale.y *= -1

  const box = new THREE.Box3().setFromObject(temp)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  const scale = targetHeight / size.y

  return parts.map(({ geometry, materialType }) => {
    const geo = geometry.clone()
    geo.scale(1, -1, 1)
    geo.translate(-center.x, -center.y, -center.z)
    geo.scale(scale, scale, scale)
    geo.computeVertexNormals()
    return { geometry: geo, materialType }
  })
}
