precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 i = floor(gl_FragCoord.xy / vec2(30.0, 100.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(20.0, 20.0));
    float timer = floor(u_time);
    vec3 color = vec3(
        rand(i + 0.1 * timer ),
        rand(i + 0.2* timer),
        rand(i + 0.3* timer)
    );
    
    float count = rand(i + timer);
    float m = step(0.7, count);
    vec3 color2 = vec3(f.x + mod(u_time, 1.), f.y + mod(u_time , 1.),1. - rand(f.xy) + mod(u_time , 1.));
    

   
    gl_FragColor = vec4(mix(color, color2, m), abs(sin(timer/10.)));
    //  gl_FragColor = vec4(vec3(f.x, f.y,1. - f.y), 1.);
    // abs(sin(timer/10.))
}