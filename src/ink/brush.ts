// A calligraphy brush as a row of bristles, each with its own ink. Pure so it can be tested without a canvas.

export interface Bristle {
  /** Position across the brush, -1 (one edge) to 1 (the other) */
  offset: number;
  thickness: number;
  /** 1 when freshly dipped, 0 when dry */
  load: number;
  /** How fast this bristle gives up its ink */
  thirst: number;
  /** px of stroke left before a lifted bristle touches the paper again */
  gap: number;
}

export interface BrushPoint {
  x: number;
  y: number;
  /** Brush width at this point, in px */
  w: number;
}

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  alpha: number;
}

export const BRISTLES = 14;
export const MIN_WIDTH = 3;
export const MAX_WIDTH = 24;
/** A pause this long lifts the brush; the next movement starts a fresh, re-dipped stroke */
export const PAUSE_MS = 250;
/** Ink each bristle spends per px of stroke, before its thirst */
const SPEND = 0.0009;

export function dipBrush(rand = Math.random): Bristle[] {
  return Array.from({ length: BRISTLES }, (_, i) => {
    const offset = (i / (BRISTLES - 1)) * 2 - 1 + (rand() - 0.5) * 0.12;
    return {
      offset,
      thickness: 0.6 + rand() * 0.8,
      load: 0.85 + rand() * 0.15,
      // edge bristles hold less ink and run dry first, which leaves the streaky "flying white" (飞白)
      thirst: 0.7 + Math.abs(offset) * 0.9 + rand() * 0.4,
      gap: 0,
    };
  });
}

/**
 * How wide the brush wants to be. A pen reports real pressure; otherwise speed stands in for it:
 * a slow brush is pressed down and spreads, a fast one lifts onto its tip.
 * @param speed px per ms
 */
export function targetWidth(speed: number, pressure?: number): number {
  if (pressure !== undefined) return MIN_WIDTH + (MAX_WIDTH - MIN_WIDTH) * Math.min(1, Math.max(0, pressure));
  return MAX_WIDTH - (MAX_WIDTH - MIN_WIDTH) * Math.min(1, speed / 2.5);
}

/** Width changes lag the hand, so a stroke swells and thins smoothly instead of jumping */
export const easeWidth = (current: number, target: number) => current + (target - current) * 0.2;

/** One line per inked bristle from a to b, then spend the ink that distance costs */
export function strokeSegments(a: BrushPoint, b: BrushPoint, bristles: Bristle[], rand = Math.random): Segment[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return [];
  const nx = -dy / len;
  const ny = dx / len;
  const out: Segment[] = [];
  for (const br of bristles) {
    if (br.load <= 0.02) continue;
    if (br.gap > 0) {
      br.gap -= len;
      continue;
    }
    // a drying bristle lifts off the paper for runs, so the stroke breaks into long streaks
    const dryness = 1 - Math.min(1, br.load * 1.6);
    if (rand() < dryness * len * 0.04) {
      br.gap = (8 + rand() * 50) * dryness;
      continue;
    }
    const ha = (br.offset * a.w) / 2;
    const hb = (br.offset * b.w) / 2;
    out.push({
      x1: a.x + nx * ha,
      y1: a.y + ny * ha,
      x2: b.x + nx * hb,
      y2: b.y + ny * hb,
      width: (((a.w + b.w) / 2) * 2.4 * br.thickness) / BRISTLES,
      alpha: 0.8 * Math.pow(br.load, 0.6),
    });
  }
  for (const br of bristles) br.load = Math.max(0, br.load - len * br.thirst * SPEND);
  return out;
}

export const meanLoad = (bristles: Bristle[]) => bristles.reduce((s, b) => s + b.load, 0) / bristles.length;
