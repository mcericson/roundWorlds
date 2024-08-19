
uniform mediump float u_time;
uniform vec2 u_resolution;
uniform int hatch_density;
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
 
    float r = random(colorVecA, colorVecB)/color_val_r;
    float g = random(colorVecA, colorVecB)/color_val_g;
    float b = random(colorVecA, colorVecB)/color_val_b;
    float  a = 1.0;
    vec4 color = vec4(1.0,1.0,1.0, 1.0);



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
    float angle =dot(vectorX, vectorY1);
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

vec2 colVecA = vec2(vec_x, vec_y);


gl_FragColor = parabolicHatch( mouseVec, animVec, pos, .0005,colVecA,  u_time, hatch_density );


 
}
