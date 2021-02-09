// Variable qualifiers that come with the msdf shader
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;

// We passed this one
uniform float uTime;
uniform vec2 uResolution;

void main() {
  vUv = uv;

  vec3 p = vec3(position.x, position.y, position.z);

  float frequency1 = 0.035;
  float amplitude1 = 2.0;
  float frequency2 = 0.025;
  float amplitude2 = 10.0;

  // Oscillate vertices up/down
  p.y += (sin(p.x * frequency1 + uTime) * 0.5 + 0.5) * amplitude1;

  // Oscillate vertices inside/outside
  p.z += (sin(p.x * frequency2 + uTime) * 0.5 + 0.5) * amplitude2;
  
  // send screen pos to varying
  vec4 tmp = modelViewMatrix * vec4(p, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * position;
}