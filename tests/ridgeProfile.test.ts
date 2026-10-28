import { describe, expect, it } from 'vitest';
import { LAYERS, LAYER_SPACING, RIDGE_BOTTOM, layerParams, ridgeHeight } from '../src/scene/ridgeProfile';

describe('ridge profile', () => {
  it('is deterministic, so the range looks the same on every visit', () => {
    expect(ridgeHeight(3.7, 2)).toBe(ridgeHeight(3.7, 2));
  });

  it('places each layer one spacing further back', () => {
    for (let l = 1; l < LAYERS; l++) {
      expect(layerParams(l).z - layerParams(l - 1).z).toBeCloseTo(-LAYER_SPACING);
    }
  });

  it('raises distant ranges toward the horizon on average', () => {
    const mean = (layer: number) => {
      let sum = 0;
      for (let x = -40; x <= 40; x += 0.5) sum += ridgeHeight(x, layer);
      return sum / 161;
    };
    expect(mean(LAYERS - 1)).toBeGreaterThan(mean(0));
  });

  it('keeps every ridge line above the bottom of its strip', () => {
    for (let l = 0; l < LAYERS; l++) {
      for (let x = -50; x <= 50; x += 1) expect(ridgeHeight(x, l)).toBeGreaterThan(RIDGE_BOTTOM);
    }
  });
});
