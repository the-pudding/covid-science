uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_depth;
uniform sampler2D u_test;

attribute vec2 uv;
attribute vec3 position;

varying vec2 vUv;
varying float depth;

void main() {
  vUv = uv; // update vUv for frag

  vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);

  float pct = 0.0;
  pct = distance(modelPosition.xy, vec2(0.0));
  modelPosition.z += (pct * 1.31) - 5.0; // concave
  // modelPosition.z += (pct * -1.0) + 4.0;  // convex


  gl_Position = projectionMatrix * modelPosition;
}