import { MAX_WIDTH, MIN_WIDTH, PAUSE_MS, dipBrush, easeWidth, meanLoad, strokeSegments, targetWidth, type Bristle, type BrushPoint } from './brush';

interface Stroke {
  last: BrushPoint;
  t: number;
  bristles: Bristle[];
}

/** Brush strokes from the pointer: a mouse paints as it moves, a finger or pen while pressed, a click presses the brush down */
export function createInk(canvas: HTMLCanvasElement) {
  const g = canvas.getContext('2d');
  if (!g) return null;
  let w = 0;
  let h = 0;
  let stroke: Stroke | null = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    g!.setTransform(dpr, 0, 0, dpr, 0, 0);
    // butt caps: round ones overlap at every joint and stipple the stroke with darker dots
    g!.lineCap = 'butt';
  }
  resize();
  window.addEventListener('resize', resize);

  const begin = (x: number, y: number, t: number, width = MIN_WIDTH) => {
    stroke = { last: { x, y, w: width }, t, bristles: dipBrush() };
  };

  function paint(a: BrushPoint, b: BrushPoint, s: Stroke) {
    // a faint wet body under the bristles, so a loaded stroke reads as one mark
    g!.strokeStyle = `rgba(23,23,27,${0.1 * meanLoad(s.bristles)})`;
    g!.lineWidth = (a.w + b.w) / 2;
    g!.beginPath();
    g!.moveTo(a.x, a.y);
    g!.lineTo(b.x, b.y);
    g!.stroke();
    for (const seg of strokeSegments(a, b, s.bristles)) {
      g!.strokeStyle = `rgba(23,23,27,${seg.alpha})`;
      g!.lineWidth = seg.width;
      g!.beginPath();
      g!.moveTo(seg.x1, seg.y1);
      g!.lineTo(seg.x2, seg.y2);
      g!.stroke();
    }
  }

  function moveTo(x: number, y: number, t: number, pressure?: number) {
    if (!stroke || t - stroke.t > PAUSE_MS) return begin(x, y, t);
    const { last } = stroke;
    const speed = Math.hypot(x - last.x, y - last.y) / Math.max(1, t - stroke.t);
    const next = { x, y, w: easeWidth(last.w, targetWidth(speed, pressure)) };
    paint(last, next, stroke);
    stroke.last = next;
    stroke.t = t;
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' && !e.buttons) return;
      const pressure = e.pointerType === 'pen' ? e.pressure : undefined;
      // coalesced events carry every sample between frames, which keeps fast curves smooth
      for (const ev of e.getCoalescedEvents?.() ?? [e]) moveTo(ev.clientX, ev.clientY, ev.timeStamp, pressure);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => (stroke = null));
  window.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') stroke = null;
  });
  window.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('a, button')) return;
    // pressing the brush down leaves a soft dab, and the stroke leaves it wide
    const r = MAX_WIDTH * 0.45;
    const dab = g!.createRadialGradient(e.clientX, e.clientY, 0, e.clientX, e.clientY, r);
    dab.addColorStop(0, 'rgba(23,23,27,.38)');
    dab.addColorStop(0.7, 'rgba(23,23,27,.22)');
    dab.addColorStop(1, 'rgba(23,23,27,0)');
    g!.fillStyle = dab;
    g!.beginPath();
    g!.arc(e.clientX, e.clientY, r, 0, Math.PI * 2);
    g!.fill();
    begin(e.clientX, e.clientY, e.timeStamp, MAX_WIDTH * 0.8);
  });

  return {
    start() {
      const loop = () => {
        // slowly lift old ink off the page so strokes dry away over a few seconds
        g!.globalCompositeOperation = 'destination-out';
        g!.fillStyle = 'rgba(0,0,0,0.006)';
        g!.fillRect(0, 0, w, h);
        g!.globalCompositeOperation = 'source-over';
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
  };
}
