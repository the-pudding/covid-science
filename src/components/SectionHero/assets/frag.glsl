#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;
uniform sampler2D map;

varying vec2 vUv;

uniform vec2 uResolution;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}
void main() {
  vec3 sample = texture2D(map, vUv).rgb;
  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
  
  float pos = gl_FragCoord.x / uResolution.x;

  gl_FragColor = vec4(.05, 0.09, .01, alpha * .9);
  if (gl_FragColor.a < 0.0001) discard;
}