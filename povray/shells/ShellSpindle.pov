// -w240 -h180 +a0.3
camera { location  <0, 6, -20> look_at <-0.2, -4.5, 0> angle 34}

sky_sphere { pigment {
    function{abs(y)}
    color_map { [0.0 color blue 0.6] [1.0 color rgb 1] }
  }
}

light_source {<100,200,-100> colour rgb 1}
light_source {<-100,-200,-100> colour rgb 0.5}


sphere {0,20 
  pigment {checker rgb 0, rgb 1 scale 4}
  no_image
  no_shadow
}

// "u" goes along the helix
// "v" goes round the cross section


#declare N=5.6;  // number of turns
#declare H=3.5;  // height
#declare P=2;    // power
#declare L=4;    // Controls spike length
#declare K=9;    // Controls spike sharpness

#declare W = function(u){pow(u/(2*pi),P)}

#declare Fx = function(u,v){W(u)*cos(N*u)*(1+cos(v))}
#declare Fy = function(u,v){W(u)*sin(N*u)*(1+cos(v))}
#declare Fz = function(u,v){W(u)*(sin(v)+pow(sin(v/2),K)*L)  + H*pow(u/(2*pi),P+1)}

#include "param.inc"

object{
    Parametric(
       Fx, Fy, Fz,
       <FromU(0),0>,<2*pi,2*pi>,
       250,50,""
    )
    pigment {rgb 0.9}
    finish {
      phong 0.5
      phong_size 10
      reflection 0.1
      }
  no_shadow
  rotate x*120
}


