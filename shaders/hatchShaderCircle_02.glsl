
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


void main() {

    //normalize


    float hatch_angle = u_time/2.0;


   
    vec2 pos = gl_FragCoord.xy/u_resolution.xy;

    //set bg color to black
    
    float r  = color_val_r/255.0;
    float g = color_val_g/255.0;
    float b = color_val_b/255.0;
    float  a = 1.0;
    gl_FragColor = vec4(1.0,1.0,1.0, a);

    //Line width and point radius in openGL screen space 'units'
    float lineWidth = 0.0004;
    
    float centerX = u_resolution.x/center_div;
    float centerY = u_resolution.y/center_div;
    float xV2 = gl_FragCoord.x-centerX;
    float yV2 = gl_FragCoord.y -centerY;
    float xV = gl_FragCoord.x-cvec_x;
    float yV = gl_FragCoord.y + cvec_y;




    vec2 vectorX1 = normalize((vec2(xV, yV)) - radians(hatch_angle))* screen_scale;
    vec2 vectorX = normalize(vec2(vec_x, vec_y));
    vec2 vectorY1 = normalize(vec2(xV, yV)) * screen_scale ;
    vec2 vectorY = normalize(vec2(u_resolution.x, u_resolution.y))*screen_scale*10.0;


    float lineWidthHalf = lineWidth;
    float radius = 1.0;
    int stop = hatch_density*2;
    int stp = 2;
    float px1 = -2.0;
    float py1 = -2.0;

    //float px1 = 0;
    for (int i = 0; i<stop; i+=stp){
        
    float divisor = float(stop);
    float fltStp = 1.0/(divisor/4.0);
    float angVal = 360.0 / float(hatch_density);
    float ang = dot(vectorX1, vectorX);
    px1 += float(i)*.000006;///u_time;
    py1 += float(i)*.000006;///u_time;
    float angle = dot(vectorX, vectorY1);
    
    float px = cos(angle)*radius + px1;
    float py = sin(angle)*radius + py1;
    vec2 point2 = vec2(px, py);
    //line equation

    
    vec2 circle = vec2(px, py);
    
    //if current pixel is inside the line, set it's color to color value
    if ((pos.y > circle.y-lineWidthHalf && pos.y < circle.y+lineWidthHalf) || (pos.x > circle.x-lineWidthHalf && pos.x < circle.x+lineWidthHalf))
        gl_FragColor = vec4(r, g, b, a);}
                    if (gl_FragColor.a < 0.1)
    discard;
}
