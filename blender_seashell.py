import bpy
from math import *
from bpy.types import Operator

'''
bl_info = {
    "name" : "Seashell",
    "category": "Add Mesh"
}

class AddSeashellSurface(Operator):
    bl_idname = "mesh.primitive_seashell_function_surface"
    bl_label = "Add Seashell Function Surface"
    bl_description = "Add a surface defined by parametric seashell function"
    bl_options = {'REGISTER', 'UNDO', 'PRESET'}

    x_eq: StringProperty(
                name="X equation",
                description="Equation for x=F(u,v). ",
                default="cos(v)*(1+cos(u))*sin(v/8)"
                )
    y_eq: StringProperty(
                name="Y equation",
                description="Equation for y=F(u,v). ",
                default="sin(u)*sin(v/8)+cos(v/8)*1.5"
                )
    z_eq: StringProperty(
                name="Z equation",
                description="Equation for z=F(u,v). ",
                default="sin(v)*(1+cos(u))*sin(v/8)"
                )
    range_u_min: FloatProperty(
                name="U min",
                description="Minimum U value. Lower boundary of U range",
                min=-100.00,
                max=0.00,
                default=0.00
                )
    range_u_max: FloatProperty(
                name="U max",
                description="Maximum U value. Upper boundary of U range",
                min=0.00,
                max=100.00,
                default=2 * pi
                )
    range_u_step: IntProperty(
                name="U step",
                description="U Subdivisions",
                min=1,
                max=1024,
                default=32
                )
    wrap_u: BoolProperty(
                name="U wrap",
                description="U Wrap around",
                default=True
                )
    range_v_min: FloatProperty(
                name="V min",
                description="Minimum V value. Lower boundary of V range",
                min=-100.00,
                max=0.00,
                default=0.00
                )
    range_v_max: FloatProperty(
                name="V max",
                description="Maximum V value. Upper boundary of V range",
                min=0.00,
                max=100.00,
                default=4 * pi
                )
    range_v_step: IntProperty(
                name="V step",
                description="V Subdivisions",
                min=1,
                max=1024,
                default=128
                )
    wrap_v: BoolProperty(
                name="V wrap",
                description="V Wrap around",
                default=False
                )
    close_v: BoolProperty(
                name="Close V",
                description="Create faces for first and last "
                            "V values (only if U is wrapped)",
                default=False
                )

    def execute(self, context):
        seashell()
'''

def l(n):
    return '((2*pi/%d) * ((%d * u/(2*pi)) - floor(%d * u/(2*pi))))' % (n,n,n)

def k(a, b, ll, p, w1, w2, n):
    if w1 == 0 or w2 == 0 or n == 0:
        return '0'
    else:
        return '(%d * exp(-(2*(u-%d)/%d)**2 - (2*%s/%d)**2))' % (ll, p, w1, l(n), w2)

def h(a,b,ll,p,w1,w2,n):
    return ('((1.0 / (sqrt((cos(u)/%d)**2 + (sin(u)/%d)**2)))+' % (a,b)) + k(a,b,ll,p,w1,w2,n) + ')'

def seashell(D=1, A=46, alpha=radians(82), beta=radians(2),
             mu=radians(1), omega=radians(10), phi=radians(-56),
             a=38, b=45, ll=0, p=0, w1=0, w2=0, n=0,
             range_u_min=0, range_u_max=2*pi, range_u_step=128,
             wrap_u=False, range_v_min=0, range_v_max=2*pi,
             range_v_step=128, wrap_v=False, close_v=False, expo=2):
    rad = 'exp(%f*v*(1/tan(%f)))*0.2' % (expo,alpha)
    x_eq = '%f*(%f*sin(%f)*cos(v)+%s*(cos(u+%f)*cos(v+%f) - sin(%f)*sin(u+%f)*cos(v+%f)))*%s' % (D, A, beta, h(a,b,ll,p,w1,w2,n), phi, omega, mu, phi, omega, rad)
    y_eq = '(-%f*sin(%f)*sin(v)-%s*(cos(u+%f)*sin(v+%f)+sin(%f)*sin(u+%f)*cos(v+%f)))*%s' % (A, beta, h(a,b,ll,p,w1,w2,n), phi, omega, mu, phi, omega, rad)
    z_eq = '(-%f * cos(%f)+%s*sin(u+%f)*cos(%f))*%s' % (A, beta, h(a,b,ll,p,w1,w2,n), phi, mu, rad)

    print('x:', x_eq)
    print('y:', y_eq)
    print('z:', z_eq)

    bpy.ops.mesh.primitive_xyz_function_surface(
        x_eq=x_eq,
        y_eq=y_eq,
        z_eq=z_eq,
        range_u_min=range_u_min,
        range_u_max=range_u_max,
        range_u_step=range_u_step,
        wrap_u=wrap_u,
        range_v_min=range_v_min,
        range_v_max=range_v_max,
        range_v_step=range_v_step,
        wrap_v=wrap_v,
        close_v=close_v)

def oliva():
    seashell(D=1, A=7, alpha=radians(88), beta=radians(12),
             mu=radians(0), omega=radians(0), phi=radians(78),
             a=6, b=1.5, ll=0, p=0, w1=0, w2=0, n=0)

def radix():
    seashell(range_u_max=8.0, range_v_min=-4*pi, range_v_max=4*pi,
             range_u_step = 512, range_v_step=512,
             A=26, expo=2,
             alpha=radians(87), beta=radians(12),
             mu=radians(10), omega=radians(0),
             phi=1.22, a=20, b=15,
             ll=0, p=0, w1=0,
             w2=0, n=0)

'''
bpy.ops.mesh.primitive_xyz_function_surface(
x_eq="cos(v)*(1+cos(u))*sin(v/8)",
y_eq="sin(u)*sin(v/8)+cos(v/8)*1.5",
z_eq="sin(v)*(1+cos(u))*sin(v/8)",
range_u_min=0,
range_u_max=6.28319,
range_u_step=32,
wrap_u=True,
range_v_min=0,
range_v_max=12.5664,
range_v_step=128,
wrap_v=False,
close_v=False, n_eq=1, a_eq="0", b_eq="0", c_eq="0", f_eq="0", g_eq="0", h_eq="0")

cursor = bpy.context.scene.cursor_location

radius = 5
anglesInRadians = [radians(degree) for degree in range(0, 360, 36)]

for theta in anglesInRadians:
    x = cursor.x + radius * cos(theta)
    y = cursor.y + radius * sin(theta)
    z = cursor.z
    add_cube(location=(x,y,z))
'''
