import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/sections.css';
import { renderContent } from './content/render';
import { supportsWebGL } from './lib/webgl';
import { addRidges, flatRidgeMaterial } from './scene/ridges';
import { createStage } from './scene/stage';

renderContent();

const canvas = document.getElementById('scene') as HTMLCanvasElement;
if (supportsWebGL()) {
  const stage = createStage(canvas);
  addRidges(stage.scene, flatRidgeMaterial);
  stage.camera.lookAt(0, 2.6, -20);
  stage.start();
} else {
  canvas.hidden = true;
}
