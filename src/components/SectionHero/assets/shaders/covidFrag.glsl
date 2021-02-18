precision highp float;
uniform vec2 u_resolution;
uniform sampler2D u_overlay;

varying vec2 vUv;

#pragma glslify: map = require(./map);

float scaleX;
float scaleY;

void main()
{
    vec2 st = gl_FragCoord.xy / u_resolution;
    
    // set alpha based on distance from center x
    float alpha = abs(distance(st.x, 0.5)) * 2.0; 
    alpha = map(alpha, 0.0, 0.5, 0.0, 1.0);

    // sample overlay
    alpha = 1.0;

    float aspectRatio = u_resolution.x / u_resolution.y; 

    scaleX = 1.0;
    scaleY = 1.0/aspectRatio;
    

    vec2 fromCenter = st-vec2(0.5, 0.5);
    vec2 scaledFromCenter = fromCenter * vec2(scaleX, scaleY);
    scaledFromCenter = scaledFromCenter * 2.0;
    vec2 sampleCoord = vec2(0.5, 0.5) + scaledFromCenter;
    vec4 texel = texture2D(u_overlay, sampleCoord);


    gl_FragColor = vec4(texel.r, 0.0, 0.0, alpha);
}