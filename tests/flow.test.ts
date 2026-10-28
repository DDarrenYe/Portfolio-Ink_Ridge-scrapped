import { describe, expect, it } from 'vitest';
import { MAX_DROPS, spill, stepDrop, type Drop } from '../src/ink/flow';

const drop = (): Drop => ({ x: 100, y: 100, vx: 0, vy: 0, r: 2, a: 0.1, life: 1 });

describe('ink drops', () => {
  it('spread and fade each frame', () => {
    const d = drop();
    stepDrop(d, 0);
    expect(d.r).toBeGreaterThan(2);
    expect(d.life).toBeLessThan(1);
  });

  it('dry up after a bounded number of frames', () => {
    const d = drop();
    let frames = 0;
    while (stepDrop(d, frames / 60)) frames++;
    expect(frames).toBeGreaterThan(60);
    expect(frames).toBeLessThan(120);
  });

  it('never exceed the drop cap', () => {
    const drops: Drop[] = [];
    for (let i = 0; i < 50; i++) spill(drops, 0, 0, 1, 1, 60, 2);
    expect(drops).toHaveLength(MAX_DROPS);
  });
});
