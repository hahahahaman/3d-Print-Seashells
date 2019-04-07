var program;

function setup() {
	pixelDensity(1);
  createCanvas(852*2, 1103*2, WEBGL);
	
	gl = this.canvas.getContext('webgl');
	
	rectMode(CENTER);
	noStroke();
	fill(1);
	
	program = createShader(vert,frag);
}

function draw() {
	shader(program);
  background(0);
	
	program.setUniform('u_resolution', [width,height]);
	program.setUniform('u_time', millis()/1000);
	
	rect(0,0, width,height);
}

var vert=`
#ifdef GL_ES
      precision highp float;
      precision highp int;
    #endif
		#extension GL_OES_standard_derivatives : enable

    // attributes, in
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    attribute vec4 aVertexColor;

    // attributes, out
    varying vec3 var_vertPos;
    varying vec4 var_vertCol;
    varying vec3 var_vertNormal;
    varying vec2 var_vertTexCoord;

    // matrices
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    //uniform mat3 uNormalMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

      // just passing things through
      // var_vertPos      = aPosition;
      // var_vertCol      = aVertexColor;
      // var_vertNormal   = aNormal;
      // var_vertTexCoord = aTexCoord;
    }
`;

var frag=`


#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 10
#define NUM_FBM 3
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st)*1.236;
        _st = rot * _st * 1.608 + shift;
        a *= 0.588;
    }
    return v;
}

float nested_fbm(in vec2 _st, float s){
    vec2 p = vec2(0.);
    for(int i = 0; i < NUM_FBM-1; i++){
        float float_i = float(i);
        vec2 q = vec2(0.);
        vec2 shift = vec2(float_i*s*0.080, float_i*s*0.492);
        q.x = sin(fbm(_st + 3.904*p + shift));
        q.y = fbm(_st + 4.344*p + shift);
        
        p = q;
    }

    return fbm(_st + 3.504*p);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*4.120;
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    // st += st * abs(sin(u_time*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + .01*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 5.272*q + vec2(0.2,22.0)+ -0.001*u_time );
    r.y = fbm( st + 4.992*q + vec2(8.3,2.8)+ 0.0001*u_time);

    vec2 s = vec2(0.);
    s.x = fbm(st + 6.808*r + vec2(0.150,-0.460) + 0.001*u_time);
    s.y = fbm(st + 7.968*r + vec2(-0.160,0.230) + 0.003*u_time);
    
    float f = fbm(st+2.0*s);
    float f1 = nested_fbm(st, 2.400);
    float f2 = nested_fbm(st, 3.800);
    float f3 = nested_fbm(st, 2.584);
    
    color = mix(color,
                vec3(f3, f, f2),
                clamp(f*f*f,0.0,1.0));
    
    float cr = clamp(f3*f*(1.0-uv.x)*cos(uv.x), 0.0, 1.0);
    float cg = 0.0;
    float cb = clamp(f2*f*cos(uv.x),0.0, 1.0);
    
    gl_FragColor = vec4(vec3(cr,cg,cb)*0.6*color, 1.0);
}
`;
