#define TEX_WIDTH 1024.0
#define TEX_HEIGHT 1024.0

#define ROWS 50.0
#define COLS 200.0

#define CHAR_WIDTH 8.0
#define CHAR_HEIGHT 18.0

precision highp float;

uniform vec2 iResolution;
uniform int iFrame;
uniform float iTime;
uniform sampler2D u_texture;
uniform sampler2D u_chars;

void main() {
    float texWidth = 1024.0;
    float texHeight = 1024.0;

    float x = gl_FragCoord.x;
    float y = abs(600.0 - gl_FragCoord.y);

    float col = floor(x / CHAR_WIDTH);
    float row = floor(y / CHAR_HEIGHT);

    float charIndex = texture2D(u_chars, vec2(
        col / 256.0,
        row / 256.0
    )).r;


    float charX = mod(x, CHAR_WIDTH) + CHAR_WIDTH * charIndex;
    float charY = mod(y, CHAR_HEIGHT);

    vec2 texUV = vec2(
        charX / texWidth,
        charY / texHeight
    );

    vec4 color = texture2D(u_texture, texUV);
    gl_FragColor = color;
}

void main2() {
    vec2 position = gl_FragCoord.xy / iResolution.xy;

    float texWidth = 1024.0;
    float texHeight = 1024.0;

    float x = gl_FragCoord.x;
    float y = abs(iResolution.y - gl_FragCoord.y);

    float col = floor(x / CHAR_WIDTH);
    float row = floor(y / CHAR_HEIGHT);

    float charIndex = texture2D(u_chars, vec2(
        col / 256.0,
        row / 256.0
    )).r;

    charIndex = 0.0;

    float charX = mod(x, CHAR_WIDTH) + CHAR_WIDTH * charIndex;
    float charY = mod(y, CHAR_HEIGHT);

    vec2 texUV = vec2(
        charX / texWidth,
        charY / texHeight
    );

    vec4 t = texture2D(u_texture, texUV);
    gl_FragColor = t;
}
