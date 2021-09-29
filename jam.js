//vertex shader content
const VS_SOURCE = `
    precision highp float;
    
    attribute vec4 aVertexPosition;
    
    void main(void) {
      gl_Position = aVertexPosition;
    }
`;

//fragment my code
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

main(); 
//js main
function main() {
 
  //canvas id in html
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

//get vertex shader and gragment shader
  const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex_shader, VS_SOURCE);
  gl.compileShader(vertex_shader);

  const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment_shader, FS_SOURCE);
  gl.compileShader(fragment_shader);

  const shader_program = gl.createProgram();
  gl.attachShader(shader_program, vertex_shader);
  gl.attachShader(shader_program, fragment_shader);
  gl.linkProgram(shader_program);


//get position from source
  const vertex_position_location = gl.getAttribLocation(shader_program, 'aVertexPosition');



  const position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  const positions = [
  1.0, 1.0, // ?
  -1.0, 1.0, // ?
  1.0, -1.0, // ?
  -1.0, -1.0 // ?
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertex_position_location, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertex_position_location);


  //////////////////////////////////////////////
  // ?
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


  //////////////////////////////////////////////
  // ?

  // ?
  gl.clearColor(0., 0., .0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // ?
  gl.useProgram(shader_program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}

