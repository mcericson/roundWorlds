varying vec3 v_pos;
varying vec3 v_normal;
uniform vec3 light_pos;



uniform mediump float u_time;
uniform vec2 u_resolution;
uniform int hatch_density;
uniform float color_val_red_ground;
uniform float color_val_green_ground;
uniform float color_val_blue_ground;

uniform float color_val_r;
uniform float color_val_g;
uniform float color_val_b;

uniform float screen_scale;
uniform float vec_x;
uniform float vec_y;
uniform float center_div;
uniform float cvec_x;
uniform float cvec_y;


//gl.enable(gl.BLEND);
//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

float diffuse(vec3 light_po, vec3 v_nor, vec3 v_po){

    vec3 light_po2 = vec3 (cvec_x, cvec_y, 100.0);
    vec3 norm2 = vec3(v_po.x, v_po.y, v_po.z );
    vec3 flipped = v_nor * vec3(-1.0, -1.0, -1.0);
    vec3 normal = normalize(v_nor);
    vec3 light_dir = normalize(light_po - v_po);
    float diff = dot(light_dir, normal  );
    return clamp(diff, 0.5, 1.0);
   
    


}

   
    




float pointColor (vec2 pos){

    return fract(sin(atan(pos.y, pos.x)));
}

float randomNum(float pos){

    return fract(sin(u_time));
}

float random (vec2 pos, vec2 pos2){

    return fract(cos(dot(pos.xy, pos2))*5870.78);

}

vec4 parabolicHatch( vec2 mousePos, vec2 animateVec, vec2 pos, float lineWidth, vec2 colorVecA,  float time, int hatchDensity ){
    
    vec2 colorVecB = vec2(pointColor(pos), pos.y);
    float pi = 3.14159265359;
    //float ang1 = mouse_angle;
    float ang = atan(pos.y, pos.x) +pi/3.0 ;
     float divFactor = .04;
    float r = random(colorVecA, colorVecB)/(color_val_r *sin(ang)*divFactor);
    float g = random(colorVecA, colorVecB)/(color_val_g*sin(ang)*divFactor);
    float b = random(colorVecA, colorVecB)/(color_val_b*sin(ang)*divFactor);
    float  a = 1.0;

   
    vec4 color = vec4(r, g/3.0, b/2.0, 1.0);



    float xV = gl_FragCoord.x - cvec_x;
    float yV = gl_FragCoord.y + cvec_y;

    vec2 vectorX = normalize(animateVec) ;
    vec2 vectorY1 = normalize(mousePos)/10.0  ;

    float radius = 2.0;
    int stop = hatchDensity*4;
    int stp = 1;
    float px1 = -2.0;
    float py1 = -2.0;

    for (int i = 0; i<stop; i+=stp){
        
   

    px1 += float(i)*.000006 ;///u_time;
    py1 += float(i)*.000006 ;///u_time;
    float angle =dot(vectorX, vectorY1)*px1;
    float px = cos(angle)*radius + px1;
    float py = sin(angle)*radius + py1;
    
    //line equation

    
    vec2 circle = vec2(px, py);
    
    //if current pixel is inside the line, set it's color to color value
    if ((pos.y > circle.y-lineWidth && pos.y < circle.y+lineWidth) || (pos.x > circle.x-lineWidth && pos.x < circle.x+lineWidth)){
        vec4 color = vec4(r, g, b, a);
        return color;}
        
        }

return color;



}

void main() {
    
//float pointCol = float pointColor(pos)

vec2 pos = gl_FragCoord.xy/u_resolution.xy;
vec2 mouseVec = vec2(gl_FragCoord.x - cvec_x, gl_FragCoord.y - cvec_y);
vec2 animVec = vec2(vec_x, vec_y);

vec2 colVecA = vec2(vec_x, vec_y) ;
float lw = u_time/2000.0;
float diffVal = diffuse(light_pos, v_normal, v_pos) ;

//problem now with alpha channel not rendering correctly
vec4 ambientColor = vec4(0.5, 1.0, 0.79, 1.0)*10.0;
vec4 FragColor  = parabolicHatch( mouseVec, animVec, pos, lw,colVecA,  u_time, hatch_density ) *diffVal * ambientColor;
float alp = clamp(FragColor.a, 0.5, 1.0);
gl_FragColor = vec4(FragColor.x, FragColor.y, FragColor.z, alp);
 
}

 

