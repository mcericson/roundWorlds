uniform mediump float u_time;
uniform vec2 u_resolution;
uniform mediump float u_height;
uniform vec3 u_center;
uniform mediump float u_radius;
uniform mediump float u_step;
uniform mediump float u_angle;
varying vec2 vUv;
uniform mediump float stop_res;
varying vec3 v_pos;
varying vec3 v_norm;

float random (vec2 pos, vec2 pos2){

    return fract(cos(dot(pos.xy, pos2)));

}



void main() {
    v_pos = position;
    v_norm = normal;
    vUv = uv;

    
    float ang =  radians(u_time*2.0);
    float pX =  position.x * cos(ang) - position.y * sin(ang)*u_time/3.0 ;
    float pY =  position.y * cos(ang) + position.x * sin(ang)*u_time/3.0;
    float pZ =  cos(ang) * position.z *u_time/3.0;
    vec3 newPosition1 = vec3(pX, pY, pZ);
    vec2 p1 = vec2(pX, pY);
    vec2 p2 = vec2(u_radius, u_time/10.0);
    float displacement = sin(u_time) * random(p1, p2)*sin(u_time)*cos(u_time) + pX/1800.0;

   

    vec3 newPosition2 = newPosition1 * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition2, .6);
}   