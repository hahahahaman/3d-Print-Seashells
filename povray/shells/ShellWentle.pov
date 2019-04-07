
sky_sphere { pigment {
    function{abs(y)}
    color_map { [0.0 color rgb 0.6] [1.0 color rgb 1] }
  }
}

light_source {<100,200,-100> colour rgb 1}
light_source {<-100,-200,-100> colour rgb 0.5}


sphere {0,20 
  pigment {checker rgb 0, rgb 1 scale 4}
  no_image
  no_shadow
}

#declare N=6.6;  // number of turns
#declare H=4.0;  // height
#declare P=2;  // power
#declare A=0.2;  // Ridge Amplitude
#declare F=10;   // Ridge Frequency                 


#declare W = function(u){pow(u/(2*pi),P)}

#declare Fx = function(u,v){W(u)*(cos(N*u)-A*cos(N*F*u))*(1+cos(v))}
#declare Fy = function(u,v){W(u)*(sin(N*u)+A*sin(N*F*u))*(1+cos(v))}
#declare Fz = function(u,v){W(u)*sin(v)  + H*pow(u/(2*pi),1+P)}

#include "param.inc"

object{
    Parametric(
       Fx, Fy, Fz,
       <FromU(0),0>,<2*pi,2*pi>,
       1000,50,""
    )
    pigment {rgb 0.9}
    finish {
      phong 0.5
      phong_size 10
      reflection 0.1
      }
  no_shadow
  rotate x*80
}

//box{<-2,-1.7,-0.2><1.8,1.9,5> pigment {rgbt <1,0,0,0.9>}}
camera { location  <0, -5.0, -20> look_at <-0.2, -2.5, 0> angle 22}


