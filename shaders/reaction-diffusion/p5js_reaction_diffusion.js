let vert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 uv;
void main() {
  uv = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);

  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}
`;

let frag = `
precision mediump float;
uniform sampler2D tex0;
varying vec2 uv;

void main(){
	
  vec4 col = texture2D(tex0, uv);
  col.rgb = col.rgb/2.;
	
  gl_FragColor = col;
}
`;

// a shader variable
let uniformsShader;
let g;

function preload(){

}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(500, 500, WEBGL);
  
  // load the shader
  uniformsShader = createShader(vert, frag);
  
  g = createGraphics(500, 500);
  
}

function draw() {
  
  g.background(255);
  g.fill(0, 255, 0);
  g.rect(0,0, 500, 10);
  
  // shader() sets the active shader with our shader
  shader(uniformsShader);

  // setUniform can also send an image to a shader
  // 'cactiTex' is the name of the variable in our shader
  // cactiImg, is a normal p5 image object
  uniformsShader.setUniform('tex0', g);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
