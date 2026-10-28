attribute float aTop;

varying float vDown;
varying vec3 vWorld;

void main() {
  // distance below this column's ridge line, used for the wash gradient
  vDown = aTop - position.y;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
