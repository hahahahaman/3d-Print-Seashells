const float dt = 1.5;

#define PI 3.14159265359

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float superposed_sins(in vec2 _st){
    float x = _st.x, y = _st.y;
    float frequency = 20.;
    float val = sin(x*frequency);
    
    val += sin(x*frequency*1.72);
    val += sin(y*frequency*2.3);
    //val += sin(x*frequency*3.12);
	
    return val;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    const float _K0 = 1.;
    const float _K1 = 1.;
    const float _K2 = 1.;
    vec2 vUv = fragCoord.xy / iResolution.xy;
    vec2 texel = 1. / iResolution.xy;
    
    // 3x3 neighborhood coordinates
    float step_x = texel.x;
    float step_y = texel.y;
    vec2 n  = vec2(0.0, step_y);
    vec2 ne = vec2(step_x, step_y);
    vec2 e  = vec2(step_x, 0.0);
    vec2 se = vec2(step_x, -step_y);
    vec2 s  = vec2(0.0, -step_y);
    vec2 sw = vec2(-step_x, -step_y);
    vec2 w  = vec2(-step_x, 0.0);
    vec2 nw = vec2(-step_x, step_y);

    vec3 uv =    texture(iChannel0, vUv).xyz;
    vec3 uv_n =  texture(iChannel0, vUv+n).xyz;
    vec3 uv_e =  texture(iChannel0, vUv+e).xyz;
    vec3 uv_s =  texture(iChannel0, vUv+s).xyz;
    vec3 uv_w =  texture(iChannel0, vUv+w).xyz;
    vec3 uv_nw = texture(iChannel0, vUv+nw).xyz;
    vec3 uv_sw = texture(iChannel0, vUv+sw).xyz;
    vec3 uv_ne = texture(iChannel0, vUv+ne).xyz;
    vec3 uv_se = texture(iChannel0, vUv+se).xyz;

    if (int(fragCoord.y) == 0) { // initialize first line
        fragColor = 
            vec4(step(random(fragCoord.xy), 0.),
                 0.,
                 0.,
                 1.);
        return;
    }
    
    // laplacian, represented by 3x3 convolution matrix
    /*
	vec3 lapl  = _K0*uv + _K1*(uv_n + uv_e + uv_w + uv_s) +
        		 _K2*(uv_nw + uv_sw + uv_ne + uv_se);
    */
    
    fragColor = vec4(uv_s, 0.);
    
    vec3 lapl = uv_se + uv_sw - 2. * uv_s;
    
    const float b_a = 0.01, b_b =0.04, 
    			r_a = 0.07, r_b = 0.001, 
    			D_a = 0.015, D_b = 0.05;

	float sigma = r_a, sigma_a = 0.5;
    
    sigma = 0.1+sigma*(0.5+0.5*superposed_sins(vUv));
    //sigma = 0.1+sigma*(0.5+0.5*sin(20.*PI*vUv.x));
    
    float a = fragColor.x, b = fragColor.y, c = fragColor.z;
    
    float a_star = a*a/(1. + sigma_a * a * a) + b_a;
    float prod_a = sigma * b * a_star; // producation rate of substance a
    float rhox = 0.6 + 0.5 * sin(vUv.x);
    float da = prod_a - r_a * a + D_a * lapl.x;
    float db = b_b  - prod_a - r_b * b + D_b * lapl.y;
    float dc = 0.;
    
    fragColor += vec4(da, db, dc,0.) * dt;
    fragColor = max(fragColor, vec4(1e-5));
    //fragColor = min(fragColor, vec4(1.0));
}