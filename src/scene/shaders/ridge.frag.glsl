uniform float uInk;
uniform float uFade;
uniform vec3 uCam;
uniform vec3 uPaper;

varying float vDown;
varying vec3 vWorld;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
  // ink pools at the ridge line and washes out toward the mist below it
  float wash = exp(-vDown / uFade);
  // dry-brush streaks: stretched vertically, plus fine paper tooth
  float dry = noise(vWorld.xy * vec2(6.0, 1.4)) * 0.55 + noise(vWorld.xy * 22.0) * 0.45;
  // a darker stroke just under the silhouette, where the brush first touched
  float edge = smoothstep(0.0, 0.06, vDown) * (1.0 - smoothstep(0.06, 0.25, vDown));
  float k = clamp(uInk * (wash * (0.75 + 0.35 * dry) + edge * 0.35), 0.0, 1.0);

  // fade a layer out as the camera walks through it
  float near = smoothstep(0.8, 5.0, abs(vWorld.z - uCam.z));

  gl_FragColor = vec4(mix(uPaper, vec3(0.09, 0.09, 0.105), k), near * smoothstep(0.0, 0.04, k));
}
