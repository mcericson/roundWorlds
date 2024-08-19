uniform mediump float u_time;
uniform mediump float u_height;
uniform vec3 u_center;
uniform mediump float u_radius;
uniform mediump float u_step;
uniform mediump float u_angle;
varying vec3 v_pos;
varying vec3 v_norm;

void main() {
    v_pos = position;
    v_norm = normal;
    
    float ang =  radians(u_time/10.0);
    float pX =  position.x * cos(ang) - position.y * sin(ang) ;
    float pY =  position.y * cos(ang) + position.x * sin(ang);
    float pZ =  cos(ang) * position.z - 1000.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pX, pY, pZ, 1.0);
}   