import type { PerspectiveCamera } from 'three';
import { cameraPose, scrollProgress } from './cameraPath';

const PHONE = 640;

export interface CameraRig {
  update(): void;
  /** Scroll progress 0–1, for anything else that moves with the walk */
  progress(): number;
}

/** Walks the camera into the range as the page scrolls; the pointer leans the view a little */
export function createCameraRig(camera: PerspectiveCamera, smooth = true): CameraRig {
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener(
    'pointermove',
    (e) => {
      ptr.tx = e.clientX / window.innerWidth - 0.5;
      ptr.ty = e.clientY / window.innerHeight - 0.5;
    },
    { passive: true },
  );

  const progress = () => scrollProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);

  return {
    progress,
    update() {
      const ease = smooth ? 0.04 : 1;
      ptr.x += (ptr.tx - ptr.x) * ease;
      ptr.y += (ptr.ty - ptr.y) * ease;
      const narrow = window.innerWidth < PHONE;
      const fov = narrow ? 60 : 45;
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      const { position, target } = cameraPose(progress(), ptr.x, ptr.y, narrow);
      camera.position.set(...position);
      camera.lookAt(...target);
    },
  };
}
