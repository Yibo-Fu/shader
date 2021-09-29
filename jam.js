//////////////////////////////////////////////
// Vertex shader program
const VS_SOURCE = `
    precision highp float;

    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    varying vec4 vColor;

    void main(void) {
      vColor = aVertexColor;
      gl_Position = aVertexPosition;
    }
`;

//////////////////////////////////////////////
// Fragment shader program
const FS_SOURCE = `
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
`;

// stores the mouse position
let mouse_xy = [0, 0];

main();
function main() {
    console.log('Hello, WebGL!');

    //////////////////////////////////////////////
    // create the context
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');


    //////////////////////////////////////////////
    // keep track of the mouse position
    canvas.addEventListener('mousemove', event => {
        let bounds = canvas.getBoundingClientRect();
        let x = event.clientX - bounds.left - canvas.clientLeft;
        let y = event.clientY - bounds.top - canvas.clientTop;
        mouse_xy = [x, bounds.height - y];
        // console.log("mouse_xy", mouse_xy);
    });

    //////////////////////////////////////////////
    // compile/link the shader program

    // compile vertex shader
    const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, VS_SOURCE);
    gl.compileShader(vertex_shader);

    // compile fragment shader
    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, FS_SOURCE);
    gl.compileShader(fragment_shader);

    // link fragment and vertex shader
    const shader_program = gl.createProgram();
    gl.attachShader(shader_program, vertex_shader);
    gl.attachShader(shader_program, fragment_shader);
    gl.linkProgram(shader_program);


    //////////////////////////////////////////////
    // query the shaders for attibute and uniform "locations"
    const vertex_position_location = gl.getAttribLocation(shader_program, 'aVertexPosition');
    const vertex_color_location = gl.getAttribLocation(shader_program, 'aVertexColor');
    const u_mouse_location = gl.getUniformLocation(shader_program, "u_mouse");
    const u_time_location = gl.getUniformLocation(shader_program, "u_time");

    //////////////////////////////////////////////
    // buffer the vertex data

    // vertex position data
    const position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    const positions = [
        1.0, 1.0, // right top
        -1.0, 1.0, // left top
        1.0, -1.0, // right bottom
        -1.0, -1.0, // left bottom
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertex_position_location, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertex_position_location);


    // vertex color data
    const color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    const colors = [
        1.0, 1.0, 1.0, 1.0, // white
        1.0, 0.0, 0.0, 1.0, // red
        0.0, 1.0, 0.0, 1.0, // green
        0.0, 0.0, 1.0, 1.0, // blue
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertex_color_location, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertex_color_location);
    // configure gl
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // draw

    // clear the background
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    //////////////////////////////////////////////
    // set up animation loop
    let start_time = Date.now();
    function render() {
        // activate our program
        gl.useProgram(shader_program);

        // update uniforms
        gl.uniform2fv(u_mouse_location, mouse_xy);
        gl.uniform1f(u_time_location, (Date.now() - start_time) * .001);

        // draw the geometry
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

}


