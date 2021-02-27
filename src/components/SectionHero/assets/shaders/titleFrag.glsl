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
    float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);


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
    //sampleCoord.y += (u_mouse.y - .5) * .25;
    //sampleCoord.x -= (u_mouse.x-.5) * .25;
    
    vec4 texel = texture2D(u_overlay, sampleCoord);


    //float alpha = 1.0;
    // set color based on texel location
    if (texel.r > 0.2){
       color = vec3(0.2824, 0.2824, 0.2824); 
    } else {
        color = vec3(0.0, 0.0, 0.0);
    }
    // color = vec3(0.8157, 0.3216, 0.3216);
    // color.r = texel.r;

    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
}