// Where the camera stands for a given scroll position and pointer. Pure so it can be tested.

export interface Pose {
  position: [number, number, number];
  target: [number, number, number];
}

/** How far into the range the walk goes, in scene units */
export const WALK_DEPTH = 34;

/** Lift on phones, where the hero text stacks and would otherwise sit on the ridges */
export const PHONE_LIFT = 2.6;

/**
 * @param progress scroll progress, 0 at the top of the page and 1 at the bottom
 * @param px pointer x, -0.5 (left) to 0.5 (right)
 * @param py pointer y, -0.5 (top) to 0.5 (bottom)
 */
export function cameraPose(progress: number, px: number, py: number, narrow: boolean): Pose {
  const p = Math.min(1, Math.max(0, progress));
  const lift = narrow ? PHONE_LIFT : 0;
  const z = 12 - p * WALK_DEPTH;
  return {
    position: [px * 2.2, 2.4 + lift - py * 0.8 + p * 1.5, z],
    target: [px * 1.2, 2.6 + lift * 3.2 + p * 1.2, z - 20],
  };
}

export function scrollProgress(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  return scrollY / Math.max(1, scrollHeight - viewportHeight);
}
