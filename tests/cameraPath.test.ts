import { describe, expect, it } from 'vitest';
import { PHONE_LIFT, WALK_DEPTH, cameraPose, scrollProgress } from '../src/scene/cameraPath';

describe('camera path', () => {
  it('walks the full depth from top to bottom of the page', () => {
    const top = cameraPose(0, 0, 0, false).position[2];
    const bottom = cameraPose(1, 0, 0, false).position[2];
    expect(top - bottom).toBeCloseTo(WALK_DEPTH);
  });

  it('clamps overscroll', () => {
    expect(cameraPose(1.4, 0, 0, false)).toEqual(cameraPose(1, 0, 0, false));
    expect(cameraPose(-0.2, 0, 0, false)).toEqual(cameraPose(0, 0, 0, false));
  });

  it('lifts the camera on phones', () => {
    const wide = cameraPose(0, 0, 0, false).position[1];
    const narrow = cameraPose(0, 0, 0, true).position[1];
    expect(narrow - wide).toBeCloseTo(PHONE_LIFT);
  });

  it('maps scroll position to progress and survives a page shorter than the viewport', () => {
    expect(scrollProgress(500, 2000, 1000)).toBe(0.5);
    expect(Number.isFinite(scrollProgress(0, 600, 900))).toBe(true);
  });
});
