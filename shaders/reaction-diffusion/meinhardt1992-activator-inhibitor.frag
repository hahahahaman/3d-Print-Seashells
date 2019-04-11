float k = 1. , 
    r = 0.1, r0=5e-3, 
    r_a = 0.1, r_b = 0., 
    D_a = 4e-3, D_b = 0.0,
    sigma = 0.012;
float dt = 3.;

#define PI 3.14159265359

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
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
        fragColor = vec4(step(random(fragCoord.xy), 0.), 0., 0., 1.);
        return;
    }
    
    r *= 1. + 0.025*(2.*step(.5,random(fragCoord.xy))-1.);   // 2.5% fluctuation
    sigma = .01+sigma*(.5+1.*sin(10.*PI*vUv.x));
    
    // laplacian, represented by 3x3 convolution matrix
    
    vec3 lapl  = _K0*uv + _K1*(uv_n + uv_e + uv_w + uv_s) +
        		 _K2*(uv_nw + uv_sw + uv_ne + uv_se);
    
    fragColor = vec4(uv_s, 0.);
    
    
    //vec3 lapl = uv_se + uv_sw + uv_w + uv_e - 4. * uv_s;
    
    float a = fragColor.x, b = fragColor.y, c = fragColor.z;
    
    float d = a*a/(1.+k*a*a);
    float dd = r*b*(d + r0);
        
   	float da = dd - r_a * a + D_a * lapl.x;
    float db = sigma - dd - r_b * b + D_b * lapl.y;
    float dc = 0.;
    
    fragColor += vec4(da, db, dc,0.) * dt;
    fragColor = max(fragColor, vec4(1e-5));
}