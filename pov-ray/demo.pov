#include "colors.inc"
#include "stones.inc"

#include "textures.inc"
#include "shapes.inc"
#include "glass.inc"
#include "metals.inc"
#include "woods.inc"
#include "functions.inc"

camera {
    location <0, 0, -4>
    look_at <0, 0, 0>
}

/*
sphere{
    <0, 1, 2>, 0.5
    texture {
        Brass_Metal
    }
}

sphere{
    <0, 2, 1>, 0.5
    texture {
        pigment { rgb <1.0, 1.2, 0.2> }
    }
}
*/

/*
parametric {
    function { cos(2*pi*u - pi/2)*cos(2*pi*(-u+v)+pi/2) }
    function { cos(2*pi*v - pi/2)*cos(2*pi*(-u+v)+pi/2) }
    function { cos(2*pi*v - pi/2)*cos(2*pi*u-pi/2) }
    <0,0>, <0.5,1>
    contained_by { sphere { <0,0,0>, 1.0 } }
    accuracy 0.001
    max_gradient 10
    texture { pigment{Jade} }
}
*/

#declare RADIUS=1.2;
#declare positive_atan2 = function(y,x){select(atan2(y,x),atan2(y,x)+2*pi, atan2(y,x))};
#declare multi_atan2 = function(y,x,z,D){positive_atan2(y,x) + 2*pi*floor((pow(x,2)+pow(y,2)+pow(z,2))/pow(D,2))};
#declare ball = function (x,y,z,R){pow(x,2) + pow(y,2) + pow(z,2) - pow(R, 2)};
#declare spiral = function (x,y,z){
                  pow(x,2) + pow(y,2) + pow(z, 2)
                  - 0.5*pow(0.57721, 0.1*2*multi_atan2(y,x,z, 1))};

isosurface {
function {spiral(x,y,z)+ f_noise3d(x*10, y*10, z*10)*0.1
}
accuracy 0.01
threshold 0
open
max_gradient 10
contained_by{sphere{0, RADIUS}}

pigment {rgb .95}
finish {phong 0.5 phong_size 10}
}

sphere {0, RADIUS
        texture{
            pigment {rgbt <0,1,0,0.9>}
        }
}

light_source {
    <2,4,-6>
    color White
}
