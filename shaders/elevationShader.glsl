uniform mediump float u_time;
uniform mediump float u_height;
uniform vec3 u_center;
uniform mediump float u_radius;
uniform mediump float u_step;
varying vec3 v_pos;
varying vec3 v_norm;

void main() {
    v_pos = position;
    v_norm = normal;
    float ang = radians(u_time);
    float pX =  position.z * cos(ang)  - position.x * sin(ang) + 100.0;
    float pY =  position.x * cos(ang) + position.z * sin(ang)+ 100.0;
    float pZ =  position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pX, pY, pZ, 1.0);
    //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + cos(angle)*u_radius + u_center.x, position.z + sin(angle)*u_radius + u_center.y, position.z - position.z + 10.0, 0.1 );
    
}