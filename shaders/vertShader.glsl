varying vec3 v_pos;
varying vec3 v_normal;

void main() {

    v_pos = position;
    v_normal = normal;
        
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      
  }  
