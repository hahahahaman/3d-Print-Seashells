// -w240 -h180 +a0.3
camera { location  <0, 0, -20> look_at <3, -2.5, 0> angle 25}

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

#declare N=15.6; // number of turns
#declare H=5.0;  // height
#declare P=3;    // power
#declare T=0.8;  // Triangleness of cross section
#declare A=0.5;  // Angle of tilt of cross section (radians)
#declare S=1.5;  // Stretch

#declare W = function(u){pow(u/(2*pi),P)}

#declare Fx = function(u,v){W(u)*cos(N*u)*(1+cos(v+A)+sin(2*v+A)*T/4)}
#declare Fy = function(u,v){W(u)*sin(N*u)*(1+cos(v+A)+sin(2*v+A)*T/4)}
#declare Fz = function(u,v){S*W(u)*(sin(v+A)+cos(2*v+A)*T/4)  + S*H*pow(u/(2*pi),P+1)}

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
  rotate <80,0,60>
}


