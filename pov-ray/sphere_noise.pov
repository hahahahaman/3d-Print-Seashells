#include "colors.inc"
#include "functions.inc"

#declare S = function (x,y,z,R){pow(x,2) + pow(y,2) + pow(z,2) - pow(R,2)};

camera {
    location <1, 2, -5>
    look_at <0, 0, 0>
}

/*
isosurface {
    function { S(x,y,z,1) }
    accuracy 0.001
    threshold 0
    open
    max_gradient 3
    contained_by{sphere{0, 1.2}}
    pigment {rgb .95}
    finish {phong 0.5 phong_size 10}
}
*/

isosurface {
function { S(x,y,z,1) + f_noise3d(x*10, y*10, z*10)}
accuracy 0.001
threshold 0
open
max_gradient 10
contained_by{sphere{0, 1.2}}
pigment {rgb 1}
}

sphere {0, 1.2
        texture{
            pigment {rgbt <0,0,1,0.95>}
        }
}

light_source {
    <100,100,-100>
    color White
}