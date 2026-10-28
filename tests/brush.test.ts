import { describe, expect, it } from 'vitest';
import { BRISTLES, MAX_WIDTH, MIN_WIDTH, dipBrush, meanLoad, strokeSegments, targetWidth } from '../src/ink/brush';

// a fixed sequence so the dry-brush skips are repeatable
const seeded = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('brush', () => {
  it('dips every bristle nearly full, with the edges thirstier than the centre', () => {
    const b = dipBrush(seeded());
    expect(b).toHaveLength(BRISTLES);
    expect(Math.min(...b.map((x) => x.load))).toBeGreaterThanOrEqual(0.85);
    const centre = b[BRISTLES >> 1];
    expect(b[0].thirst).toBeGreaterThan(centre.thirst);
    expect(b[BRISTLES - 1].thirst).toBeGreaterThan(centre.thirst);
    expect(meanLoad(b)).toBeGreaterThan(0.85);
  });

  it('spreads when slow and narrows onto the tip when fast', () => {
    expect(targetWidth(0.1)).toBeGreaterThan(targetWidth(2));
    expect(targetWidth(0)).toBeLessThanOrEqual(MAX_WIDTH);
    expect(targetWidth(100)).toBeGreaterThanOrEqual(MIN_WIDTH);
  });

  it('follows pen pressure when there is one', () => {
    expect(targetWidth(5, 1)).toBe(MAX_WIDTH);
    expect(targetWidth(0, 0)).toBe(MIN_WIDTH);
  });

  it('lays bristles across the stroke, within its width', () => {
    const segs = strokeSegments({ x: 0, y: 0, w: 20 }, { x: 10, y: 0, w: 20 }, dipBrush(seeded()), seeded(2));
    expect(segs.length).toBeGreaterThan(BRISTLES / 2);
    for (const s of segs) {
      expect(Math.abs(s.y1)).toBeLessThanOrEqual(10 * 1.06);
      expect(s.x1).toBe(0);
      expect(s.x2).toBe(10);
    }
  });

  it('runs dry along a long stroke and stops marking', () => {
    const brush = dipBrush(seeded());
    const rand = seeded(3);
    const marksIn = (fromX: number) => strokeSegments({ x: fromX, y: 0, w: 16 }, { x: fromX + 20, y: 0, w: 16 }, brush, rand).length;
    const early = marksIn(0);
    let x = 20;
    while (x < 600) x += (marksIn(x), 20);
    const mid = marksIn(x);
    while (x < 3000) x += (marksIn(x), 20);
    expect(mid).toBeLessThan(early);
    expect(marksIn(x)).toBe(0);
    expect(meanLoad(brush)).toBeLessThan(0.05);
  });
});
