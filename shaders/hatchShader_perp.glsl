
uniform mediump float u_time;
uniform vec2 u_resolution;
uniform int hatch_density;
uniform float color_val_red;
uniform float color_val_green;
uniform float color_val_blue;
uniform float screen_scale;
uniform float vec_x;
uniform float vec_y;
uniform float center_div;
uniform float cvec_x;
uniform float cvec_y;




void main() {

    //normalize

    float hatch_angle = u_time;


   
    vec2 pos = gl_FragCoord.xy/u_resolution.xy;

    //set bg color to black
    
    float r  = color_val_red/255.0;
    float g = color_val_green/255.0;
    float b = color_val_blue/255.0;
    float  a = 1.0;
    gl_FragColor = vec4(1.0,1.0,1.0, 1.0);

    //Line width and point radius in openGL screen space 'units'
    float lineWidth = 0.0003;
    float lineWidthHalf = lineWidth;


    float centerX = u_resolution.x/4.0;
    float centerY = u_resolution.y/4.0;
    float xV2 = gl_FragCoord.x-centerX;
    float yV2 = gl_FragCoord.y +centerY;
    float xV = gl_FragCoord.x-cvec_x;
    float yV = gl_FragCoord.y-cvec_y;




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
    float py = sin(angle)*1.0 ;
    vec2 point2 = vec2(px, py);
    //line equation
    float m = (point1.y - point2.y)/(point1.x - point2.x);
    float c = point1.y - m*point1.x;
    vec2 line = vec2((pos.y-c)/m, pos.x*m+c);
    
    //if current pixel is inside the line, set it's color to white
    if ((pos.y > line.y-lineWidthHalf && pos.y < line.y+lineWidthHalf) || (pos.x > line.x-lineWidthHalf && pos.x < line.x+lineWidthHalf))
        gl_FragColor = vec4(r, g, b, a);}
            //if (gl_FragColor.a < 0.1)
    //discard;}
    
}