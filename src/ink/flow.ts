// The physics of a single ink drop, kept pure so it can be tested without a canvas.

export interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Peak opacity */
  a: number;
  /** 1 when spilled, 0 when gone */
  life: number;
}

export const MAX_DROPS = 900;

/** Direction of the slow current at a point: crossed sine waves, so neighbouring drops curl together */
export function flowAngle(x: number, y: number, t: number): number {
  return (Math.sin(x * 0.011 + t * 0.4) * Math.cos(y * 0.013 - t * 0.3) + Math.sin((x - y) * 0.007 + t * 0.2)) * Math.PI;
}

/** Advance one frame: the drop slows, is carried by the current, spreads and fades. Returns false once it has dried. */
export function stepDrop(d: Drop, t: number): boolean {
  const ang = flowAngle(d.x, d.y, t);
  d.vx = d.vx * 0.94 + Math.cos(ang) * 0.18;
  d.vy = d.vy * 0.94 + Math.sin(ang) * 0.18;
  d.x += d.vx;
  d.y += d.vy;
  d.r += 0.22;
  d.life -= 0.012;
  return d.life > 0;
}

/** Spill n drops at a point, thrown partly along the stroke direction */
export function spill(drops: Drop[], x: number, y: number, vx: number, vy: number, n: number, spread: number, rand = Math.random) {
  for (let i = 0; i < n && drops.length < MAX_DROPS; i++) {
    const a = rand() * Math.PI * 2;
    const s = rand() * spread;
    drops.push({ x, y, vx: vx * 0.25 + Math.cos(a) * s, vy: vy * 0.25 + Math.sin(a) * s, r: 1 + rand() * 3, a: 0.05 + rand() * 0.09, life: 1 });
  }
}
