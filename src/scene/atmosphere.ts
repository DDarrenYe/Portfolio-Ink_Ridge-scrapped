import { CanvasTexture, CircleGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, type Scene } from 'three';
import { LAYERS, LAYER_SPACING } from './ridgeProfile';

const SEAL_RED = 0xb8322a;

/** A seal-red sun low behind the farthest range */
export function addSun(scene: Scene): Mesh {
  const sun = new Mesh(new CircleGeometry(3.4, 64), new MeshBasicMaterial({ color: SEAL_RED, transparent: true, opacity: 0.88 }));
  sun.position.set(9, 7, -70);
  sun.renderOrder = 0;
  scene.add(sun);
  return sun;
}

function mistTexture(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, 'rgba(236,235,230,0)');
  grad.addColorStop(0.5, 'rgba(236,235,230,.95)');
  grad.addColorStop(1, 'rgba(236,235,230,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 64);
  return new CanvasTexture(c);
}

export interface Mist {
  update(t: number, cameraZ: number): void;
}

/** Bands of paper-coloured mist hanging between the ridge layers, drifting sideways */
export function addMist(scene: Scene, count = 6): Mist {
  const map = mistTexture();
  const bands = Array.from({ length: count }, (_, i) => {
    const m = new Mesh(
      new PlaneGeometry(70, 2.2 + Math.random() * 2),
      new MeshBasicMaterial({ map, transparent: true, depthWrite: false, opacity: 0.8 }),
    );
    // halfway between layer i and the one behind it, drawn in the same slot as that gap
    m.position.set(0, -1 + i * 0.9, -LAYER_SPACING * (i + 0.5));
    m.renderOrder = LAYERS - i;
    scene.add(m);
    return { mesh: m, drift: (Math.random() - 0.5) * 0.4 };
  });

  return {
    update(t, cameraZ) {
      bands.forEach(({ mesh, drift }, i) => {
        const x = Math.sin(t * 0.05 + i) * 6 + t * drift;
        mesh.position.x = (((x + 20) % 40) + 40) % 40 - 20;
        // thin out a band as the camera passes through it
        (mesh.material as MeshBasicMaterial).opacity = 0.75 * Math.min(1, Math.abs(mesh.position.z - cameraZ) / 4);
      });
    },
  };
}
