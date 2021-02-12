#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;
uniform sampler2D map;

uniform vec2 u_resolution;

varying vec2 vUv;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

void main() {
  // set opacity of "letter" part of the geometry
  vec3 sample = texture2D(map, vUv).rgb;
  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

  // alpha test
  alpha = step(0.5, alpha);
  
  // compute alpha as distance from center
  vec2 st = gl_FragCoord.xy / u_resolution;
  float opacity = abs(distance(st.x, 0.5)) + .1;
  opacity = 1.0;

  // gl_FragColor = vec4(.05, 0.09, .01, alpha * centerDist);
  gl_FragColor = vec4(0.25, .25, .25, alpha * opacity);
  if (gl_FragColor.a < 0.0001) discard;
}