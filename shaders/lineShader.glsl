uniform float color_val_r;
uniform float color_val_g;
uniform float color_val_b;


varying vec3 v_pos;
varying vec3 v_normal;
void main() {

    v_pos = position;
    v_normal = normal;

    float red = color_val_r/255.0;
    float green = color_val_g/255.0;
    float blue = color_val_b/255.0;

    gl_FragColor = vec4(red, green, blue, 1.0);}


