

uniform mediump float u_time;
uniform mediump float u_height;
uniform vec3 u_center;
uniform mediump float u_radius;
uniform mediump float u_step;

varying vec3 v_pos;
varying vec3 v_normal;
void main() {

    
    v_normal = normal ;
    float ang =  radians(u_time*10.0);
    float pX =  position.x * cos(ang) - position.y * sin(ang);
    float pY =  position.y * cos(ang) + position.x * sin(ang);
    float pZ =  cos(ang) * position.z + position.z;
    v_pos = vec3 (pX, pY, pZ);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pX, pY, pZ, 1.0);
    
} 