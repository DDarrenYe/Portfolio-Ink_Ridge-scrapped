import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/sections.css';
import { renderContent } from './content/render';
import { createInk } from './ink/inkCanvas';
import { prefersReducedMotion } from './lib/motion';
import { supportsWebGL } from './lib/webgl';
import { addMist, addSun } from './scene/atmosphere';
import { createCameraRig } from './scene/cameraRig';
import { inkWashMaterial, syncCamera } from './scene/ridgeShader';
import { addRidges } from './scene/ridges';
import { createStage } from './scene/stage';

renderContent();

// With reduced motion the scene is drawn as a still and follows the scroll without easing; no ink trail
const reduce = prefersReducedMotion();
if (!reduce) createInk(document.getElementById('ink') as HTMLCanvasElement)?.start();

const canvas = document.getElementById('scene') as HTMLCanvasElement;
if (supportsWebGL()) {
  const stage = createStage(canvas);
  const ridges = addRidges(stage.scene, inkWashMaterial);
  const washes = ridges.map((r) => r.material);
  const sun = addSun(stage.scene);
  const mist = addMist(stage.scene);
  const rig = createCameraRig(stage.camera, !reduce);
  stage.onFrame((t) => {
    rig.update();
    sun.position.y = 7 + rig.progress() * 3;
    syncCamera(washes, stage.camera);
    mist.update(t, stage.camera.position.z);
  });
  if (reduce) {
    stage.renderOnce();
    stage.onResize(stage.renderOnce);
    window.addEventListener('scroll', stage.renderOnce, { passive: true });
  } else {
    stage.start();
  }
} else {
  canvas.hidden = true;
}
