import { Color, ShaderMaterial, Vector3 } from 'three';
import vertexShader from './shaders/ridge.vert.glsl?raw';
import fragmentShader from './shaders/ridge.frag.glsl?raw';
import { PAPER } from './stage';

const paper = new Color(PAPER);

/** Sumi-e wash: far layers get less ink and a longer, softer fade into the mist */
export function inkWashMaterial(layer: number): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uInk: { value: 0.95 - layer * 0.1 },
      uFade: { value: 0.8 + layer * 0.35 },
      uCam: { value: new Vector3() },
      uPaper: { value: paper },
    },
  });
}

/** Keeps each ridge's near-fade in step with the camera */
export function syncCamera(materials: ShaderMaterial[], camera: { position: Vector3 }) {
  for (const m of materials) m.uniforms.uCam.value.copy(camera.position);
}
