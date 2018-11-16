precision highp float;

uniform vec2 iResolution;
uniform int iFrame;
uniform float iTime;
uniform sampler2D u_texture;

void main() {
    vec2 position = gl_FragCoord.xy / iResolution.xy;
    float width = 1024.0;
    float height = 1024.0;

    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float u = x / width + 0.5 / width;
    float v = y / height + 0.5 / height;

    vec2 texUV = gl_FragCoord.xy / 1024.0;
    vec4 t = texture2D(u_texture, texUV);
    gl_FragColor = t;
}

