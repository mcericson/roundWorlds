
uniform mediump float u_time;
uniform vec2 u_resolution;
uniform int hatch_density;
uniform float color_val_red_ground;
uniform float color_val_green_ground;
uniform float color_val_blue_ground;
uniform float screen_scale;
uniform float vec_x;
uniform float vec_y;
uniform float center_div;
uniform float cvec_x;
uniform float cvec_y;



void main() {

    //normalize

    float hatch_angle = u_time ;
    vec2 pos = gl_FragCoord.xy/u_resolution.xy;

    //set bg color to black
    
    float r  =  color_val_red_ground/255.0 ;
    float g =  color_val_green_ground/255.0 ;
    float b =  color_val_blue_ground/255.0 ;
    gl_FragColor = vec4(1.0,1.0,1.0, 1.0);

    //Line width and point radius in openGL screen space 'units'
    float lineWidth = 0.00045;
    float lineWidthHalf = lineWidth/3.0;

    float centerX = u_resolution.x/center_div;
    float centerY = u_resolution.y/center_div;
    float xV2 = gl_FragCoord.x-centerX;
    float yV2 = gl_FragCoord.y -centerY;
    float xV = gl_FragCoord.x-cvec_x;
    float yV = gl_FragCoord.y+cvec_y;




    vec2 vectorX1 = normalize((vec2(xV, yV)) - radians(hatch_angle-1.0))* screen_scale;
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
    float py = sin(angle)*1.0 + 0.0;
    vec2 point2 = vec2(px, py);
    //line equation
    float m = (point1.y - point2.y)/(point1.x - point2.x);
    float c = point1.y - m*point1.x;


    vec2 line = vec2((pos.y-c)/m, pos.x*m+c);
    
    //if current pixel is inside the line, set it's color to white
    if ((pos.y > line.y-lineWidthHalf && pos.y < line.y+lineWidthHalf) || (pos.x > line.x-lineWidthHalf && pos.x < line.x+lineWidthHalf))
        gl_FragColor = vec4(r, g, b, 1.0);}}    
