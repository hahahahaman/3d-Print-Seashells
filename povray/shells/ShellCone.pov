// -w240 -h180 +a0.3
camera { location  <0, 6, -20> look_at <-0.2, -1.0, 0> angle 18}

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

#declare N=4.6;  // number of turns
#declare H=0.5;    // height

#declare W = function(u){u/(2*pi)}

#declare Fx = function(u,v){W(u)*cos(N*u)*(1+cos(v))}
#declare Fy = function(u,v){W(u)*sin(N*u)*(1+cos(v))}
#declare Fz = function(u,v){W(u)*sin(v)*1.25  + H*pow(u/(2*pi),2) +W(u)*cos(v)*1.25}

#include "param.inc"

object{
    Parametric(
       Fx, Fy, Fz,
       <FromU(0),0>,<2*pi,2*pi>,
       250,40,""
    )
    pigment {rgb 0.9}
    finish {
      phong 0.5
      phong_size 10
      reflection 0.1
      }
  no_shadow
  rotate x*90
}


