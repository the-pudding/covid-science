#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif


precision highp float;
uniform sampler2D map;
uniform vec2 u_resolution;
uniform sampler2D u_overlay;
uniform vec2 u_mouse;

varying vec2 vUv;

float scaleX;
float scaleY;
vec3 color;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main(){
    // set opacity of "letter" part of the geometry
    vec3 sample = texture2D(map, vUv).rgb;
    float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
    float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, .9);


    // sample the covid silhouette
    vec2 st = gl_FragCoord.xy / u_resolution;
    float aspectRatio = u_resolution.x / u_resolution.y; 
    scaleX = 1.0;
    scaleY = 1.0/aspectRatio;
    vec2 fromCenter = st-vec2(0.5, 0.5);
    vec2 scaledFromCenter = fromCenter * vec2(scaleX, scaleY);
    scaledFromCenter = scaledFromCenter * 2.0;
    vec2 sampleCoord = vec2(0.5, 0.5) + scaledFromCenter;
    
    // offset by mouse
    sampleCoord.y += (u_mouse.y) * .5;
    //sampleCoord.x -= (u_mouse.x-.5) * .25;
    
    vec4 texel = texture2D(u_overlay, sampleCoord);

    // set color based on texel location
    if (texel.r > 0.2){
      //color = vec3(0.17, 0.21, 0.29);
      color = vec3(0.1922, 0.2392, 0.3333);

    } else {
      //color = vec3(0.051, 0.0588, 0.0824);
      color = vec3(0.0706, 0.0824, 0.1137);
    }

    // set transparency
    // if (alpha > .2) {
    //   alpha = 0.2;
    // }


    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
}