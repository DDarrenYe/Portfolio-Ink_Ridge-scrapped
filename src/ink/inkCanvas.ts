import { spill, stepDrop, type Drop } from './flow';

/** Ink that bleeds from the pointer: a mouse just moves, a finger or pen drags, a click splashes */
export function createInk(canvas: HTMLCanvasElement) {
  const g = canvas.getContext('2d');
  if (!g) return null;
  const drops: Drop[] = [];
  let w = 0;
  let h = 0;
  let last: { x: number; y: number } | null = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    g!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' && !e.buttons) return;
      if (last) {
        const vx = e.clientX - last.x;
        const vy = e.clientY - last.y;
        const speed = Math.hypot(vx, vy);
        if (speed > 1) spill(drops, e.clientX, e.clientY, vx, vy, Math.min(6, 1 + speed / 8), 0.6);
      }
      last = { x: e.clientX, y: e.clientY };
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => (last = null));
  window.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('a, button')) return;
    last = { x: e.clientX, y: e.clientY };
    spill(drops, e.clientX, e.clientY, 0, 0, 60, 2.2);
  });

  function step(t: number) {
    // slowly lift old ink off the page so trails fade over a few seconds
    g!.globalCompositeOperation = 'destination-out';
    g!.fillStyle = 'rgba(0,0,0,0.018)';
    g!.fillRect(0, 0, w, h);
    g!.globalCompositeOperation = 'source-over';
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      if (!stepDrop(d, t)) {
        drops.splice(i, 1);
        continue;
      }
      g!.fillStyle = `rgba(23,23,27,${d.a * d.life})`;
      g!.beginPath();
      g!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      g!.fill();
    }
  }

  return {
    start() {
      const start = performance.now();
      const loop = (now: number) => {
        step((now - start) / 1000);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
  };
}
