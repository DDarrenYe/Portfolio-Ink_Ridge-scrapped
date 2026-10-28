// Pure maths for the mountain silhouettes, kept free of three.js so it can be unit tested.

export const LAYERS = 8;
export const LAYER_SPACING = 7;
export const RIDGE_BOTTOM = -14;

export interface LayerParams {
  z: number;
  width: number;
  base: number;
  amp: number;
}

/** Layer 0 is nearest. Each layer back sits higher, wider and taller, like ranges fading toward the horizon. */
export function layerParams(layer: number): LayerParams {
  return {
    z: -layer * LAYER_SPACING,
    width: 90 + layer * 14,
    base: -2.6 + layer * 0.5,
    amp: 1.2 + layer * 0.35,
  };
}

/** Five octaves of layered sine waves; smooth, repeatable and cheap */
export function fbm(x: number, seed: number): number {
  let v = 0;
  let a = 1;
  let f = 1;
  for (let o = 0; o < 5; o++) {
    v += a * Math.sin(x * f * 0.21 + seed * (o + 1) * 1.7) * Math.cos(x * f * 0.13 - seed * o);
    a *= 0.5;
    f *= 2.1;
  }
  return v;
}

/** Height of a layer's ridge line at x, with one broad peak that steps sideways layer by layer */
export function ridgeHeight(x: number, layer: number): number {
  const { base, amp } = layerParams(layer);
  const peak = Math.max(0, 1.6 - Math.abs(x + 6 - layer * 3) * 0.12) * amp * 0.8;
  return base + fbm(x * (1 - layer * 0.04), layer * 3.1 + 1) * amp + peak;
}
