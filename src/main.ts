import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/sections.css';
import { renderContent } from './content/render';
import { supportsWebGL } from './lib/webgl';
import { createStage } from './scene/stage';

renderContent();

const canvas = document.getElementById('scene') as HTMLCanvasElement;
if (supportsWebGL()) {
  const stage = createStage(canvas);
  stage.start();
} else {
  canvas.hidden = true;
}
