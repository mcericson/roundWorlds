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
    float angle =  radians(u_time);
    float pX = cos(angle)*sin(angle)*u_radius + u_center.x + position.x;
    float pY = sin(angle)*sin(angle)*u_radius + u_center.y + position.y;
    float pZ = cos(angle)*u_radius + u_center.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(  pX,  pY, pZ ,.6);
    //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + cos(angle)*u_radius + u_center.x, position.z + sin(angle)*u_radius + u_center.y, position.z - position.z + 10.0, 0.1 );
    
}