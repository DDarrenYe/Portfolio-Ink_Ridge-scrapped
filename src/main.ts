import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/sections.css';
import { renderContent } from './content/render';
import { supportsWebGL } from './lib/webgl';
import { inkWashMaterial, syncCamera } from './scene/ridgeShader';
import { addRidges } from './scene/ridges';
import { createStage } from './scene/stage';

renderContent();

const canvas = document.getElementById('scene') as HTMLCanvasElement;
if (supportsWebGL()) {
  const stage = createStage(canvas);
  const ridges = addRidges(stage.scene, inkWashMaterial);
  const washes = ridges.map((r) => r.material);
  stage.camera.lookAt(0, 2.6, -20);
  stage.onFrame(() => syncCamera(washes, stage.camera));
  stage.start();
} else {
  canvas.hidden = true;
}
