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

  
    float angle =  radians(u_time);
    float pX = cos(angle)*u_radius + u_center.x + position.x;
    float pY = sin(angle)*u_radius + u_center.y + position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(  pX,  pY, position.z-position.z ,.75);
    //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + cos(angle)*u_radius + u_center.x, position.z + sin(angle)*u_radius + u_center.y, position.z - position.z + 10.0, 0.1 );
    
}