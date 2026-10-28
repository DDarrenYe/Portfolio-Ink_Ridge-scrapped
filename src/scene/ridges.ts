import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, type Material, type Scene } from 'three';
import { LAYERS, RIDGE_BOTTOM, layerParams, ridgeHeight } from './ridgeProfile';

const SEGMENTS = 260;

/** A vertical strip whose top edge follows the ridge line and whose bottom drops out of view */
function ridgeGeometry(layer: number): BufferGeometry {
  const { z, width } = layerParams(layer);
  const pos = new Float32Array((SEGMENTS + 1) * 2 * 3);
  const top = new Float32Array((SEGMENTS + 1) * 2);
  const index: number[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const x = -width / 2 + (width * i) / SEGMENTS;
    const y = ridgeHeight(x, layer);
    pos.set([x, y, z, x, RIDGE_BOTTOM, z], i * 6);
    top[i * 2] = y;
    top[i * 2 + 1] = y;
    if (i < SEGMENTS) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aTop', new BufferAttribute(top, 1));
  geo.setIndex(index);
  return geo;
}

export function addRidges(scene: Scene, material: (layer: number) => Material): Mesh[] {
  const ridges: Mesh[] = [];
  for (let layer = 0; layer < LAYERS; layer++) {
    const mesh = new Mesh(ridgeGeometry(layer), material(layer));
    // nearer layers draw last so they paint over the ones behind
    mesh.renderOrder = LAYERS - layer;
    scene.add(mesh);
    ridges.push(mesh);
  }
  return ridges;
}

/** Flat grey silhouettes, lighter with distance */
export const flatRidgeMaterial = (layer: number) =>
  new MeshBasicMaterial({ color: 0x17171b, transparent: true, opacity: 0.85 - layer * 0.09 });
