
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

    return fract(cos(dot(pos.xy, pos2))*5876.78);
}

void main() {

    //normalize


    float hatch_angle = radians(u_time/10000.0);


   
    vec2 pos = gl_FragCoord.xy/u_resolution.xy;

    //set bg color to black
    float div = u_time/1000.0;
    vec2 pos3 = vec2(vec_x, vec_y);
    vec2 pos4 = vec2(pointColor(pos3), vec_y);
    vec2 pos2 = vec2(pointColor(pos.xy), pos.y);
    float r  = random(pos4, pos4)/1.5;//fract(sin(dot(pos.xy, pos2)))/3.0;//255.0;
    float g = random(pos4, pos4)/1.4;
    float b = random(pos4, pos4)/1.5;//fract(sin(dot(pos.xy, pos2)));
    float  a = 1.0;
    gl_FragColor = vec4(1.0,1.0,1.0, 1.0);

    //Line width and point radius in openGL screen space 'units'
    float lineWidth = .0007;
    float lineWidthHalf = lineWidth/2.0;


    //float centerX = u_resolution.x/4.0;
    //float centerY = u_resolution.y/4.0;
    //float xV = gl_FragCoord.x;
    //float yV = gl_FragCoord.y;



    float centerX = u_resolution.x/center_div;
    float centerY = u_resolution.y/center_div;
    float xV2 = gl_FragCoord.x-centerX;
    float yV2 = gl_FragCoord.y -centerY;
    float xV = gl_FragCoord.x-cvec_x;
    float yV = gl_FragCoord.y + cvec_y;




    vec2 vectorX1 = normalize((vec2(xV, yV)) - radians(hatch_angle-90.0))* screen_scale;
    vec2 vectorX = normalize(vec2(vec_x, vec_y));
    vec2 vectorY1 = normalize(vec2(xV, yV)) *screen_scale ;
    vec2 vectorY = normalize(vec2(u_resolution.x, u_resolution.y))*screen_scale*10.0;




    int stop = hatch_density;
    int stp = 1;
    float px1 = -2.0;
    //float px1 = 0;
    for (int i = 0; i<stop; i+=stp){
    float divisor = float(stop);
    float fltStp = 1.0/(divisor/4.0);
    px1 += fltStp;
    vec2 point1 = vec2(px1, hatch_angle*10.0);
    float angle = dot(vectorX1, vectorX);
    float angle1 = radians(60.0);
    float px = cos(angle)*1.0 + px1;
    float py = sin(angle)*1.0 ;
    vec2 point2 = vec2(px, py);
    //line equation
    float m = (point1.y - point2.y)/(point1.x - point2.x);
    float c = point1.y - m*point1.x;


    vec2 line = vec2((pos.y-c)/m, pos.x*m+c);
    
    //if current pixel is inside the line, set it's color to white
    if ((pos.y > line.y-lineWidthHalf && pos.y < line.y+lineWidthHalf) || (pos.x > line.x-lineWidthHalf && pos.x < line.x+lineWidthHalf))
        gl_FragColor = vec4(r, g, b, 1.0);}
                    }   
