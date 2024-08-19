uniform mediump float u_time;
uniform mediump float u_height;
uniform vec3 u_center;
uniform mediump float u_radius;
uniform mediump float u_step;

varying vec3 v_pos;
varying vec3 v_normal;
void main() {

    v_pos = position;
    v_normal = normal;

  
    float angle =  radians(u_time*2.0);
    float pX = cos(-angle)* u_time + u_center.x + position.x;
    float pY = sin(-angle)* u_time + u_center.y + position.y;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(  pX,  pY,  -1000.0,.75);

    
}