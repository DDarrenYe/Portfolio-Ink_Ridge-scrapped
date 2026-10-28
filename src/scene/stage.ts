import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export const PAPER = 0xecebe6;

export type FrameFn = (t: number, dt: number) => void;

export interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  /** Runs before every render, in the order added */
  onFrame(fn: FrameFn): void;
  /** Runs after every resize */
  onResize(fn: () => void): void;
  start(): void;
  renderOnce(): void;
}

export function createStage(canvas: HTMLCanvasElement): Stage {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(PAPER, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(0, 2.4, 12);

  const frameFns: FrameFn[] = [];
  const resizeFns: (() => void)[] = [];

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    resizeFns.forEach((fn) => fn());
  }

  function draw(t: number, dt: number) {
    frameFns.forEach((fn) => fn(t, dt));
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();

  return {
    renderer,
    scene,
    camera,
    onFrame: (fn) => frameFns.push(fn),
    onResize: (fn) => resizeFns.push(fn),
    renderOnce: () => draw(0, 0),
    start() {
      const start = performance.now();
      let last = start;
      const loop = (now: number) => {
        draw((now - start) / 1000, Math.min(0.05, (now - last) / 1000));
        last = now;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
  };
}
