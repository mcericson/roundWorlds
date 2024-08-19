//imports

import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MeshBasicMaterial, Vector2, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import fragmentShaderCode from '/shaders/lineShader_diffuse_001.glsl';
import fragmentShaderCode2 from '/shaders/lineShader_diffuse_001.glsl'
import brokenLinecode from '/shaders/waveShaderLines001.glsl'
import brokenLinecode2 from '/shaders/waveShaderLines001.glsl'
import vertexShaderCode from '/shaders/vertShader.glsl';
import vertexShaderObl from '/shaders/spherical2.glsl';
import lineShaderSpherical from '/shaders/vertex_sphericalLine.glsl'
import shadowShader from '/shaders/spherical4.glsl'
import unrollShader from '/shaders/spherical5.glsl'
import fragShaderPlane from '/shaders/shaders/waveShaderGround003.glsl'
import planShader from '/planShader.glsl';
import elevationShader from '/shaders/elevationShader.glsl';
import elevationShaderRt from '/shaders/elevationShaderRt.glsl';
import elevationShaderLt from '/shaders/elevationShaderLt.glsl';
import { RoundObject } from './roundObject_4.js';



//renderer

var groundPlane =false;
var enableSaveFrame = true;
var renderVal = true;
var renderScale = 1.8;
var zoomScale = 1.0;
var scaleBuffer = 0.8//3.0000000000000000000000001;
var bcolor1 = setRGB(255, 255, 255);
var windowY = window.innerHeight;
var windowX = window.innerWidth;
var rev = 3.0;
var stopRes = 1.0

var rand = Math.random() * 1000.0
var frameNumber = 1//250.0;
var resInc = (stopRes/(frameNumber*5.0));
var rotInc = resInc * rand *rand *rand;
//*6.4// *rand//*6.4;
var stp = 0;
var stpVal = frameNumber * rev//(stopRes / resInc) * rev
var count2 = 0;
var maxDiv = 6//40.1;//sets recursive depth.  bigger number 
var radius = 325.0;
var maxPoints =850 + rand;
var max = radius / maxDiv;
var bColor = [0, 0, 0]

const objectCenter = {x:-300, y:-200, z:0};
const colorInc = {r: 1, g:1, b:1};
const resAdd = { x: .1, y: .1};





const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true , transparent: false});
renderer.setPixelRatio(window.devicePixelRatio*renderScale);
renderer.setSize(windowX, windowY);
document.body.appendChild(renderer.domElement);
//const bounds = renderer.domElement.getBoundingClientRect();
//console.log(bounds)

renderer.antialias = true;

//labelREnderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(windowX, windowY);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

//scene

const scene = new THREE.Scene();
scene.background = new THREE.Color(bcolor1);
//const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, .1, 10000);
const camera = new THREE.OrthographicCamera(windowX* -1, windowX, windowY, windowY * -1, -15800.0, 20000.0);
camera.zoom = zoomScale;
//camera.aspect = window.innerHeight/window.innerHeight;
//camera.updateProjectionMatrix();
const controls = new OrbitControls(camera, renderer.domElement);
const controls2 = new OrbitControls(camera, labelRenderer.domElement);
var color1 = setRGB(12, 59, 101);
var fcount = 0;
var count = 0;



const Yaxis = new THREE.Vector3(0,0,0);

var cameraY = 0
camera.position.set(1,-1,1);


controls.update();
controls2.update();



//amimation loop

const drawingCenter = new Vector3(0.0, 0.0, 0.0)

const shadUniform = {
    //u_resolution: {value: new Vector2(500,500)},
    u_resolution: { value: new Vector2(windowX * scaleBuffer, windowY* scaleBuffer) },
    hatch_density: { value: (window.innerHeight)/4000 },
    color_val_red: { value: (0.0) },
    color_val_green: { value: (0.0) },
    color_val_blue: { value: (0.0) },
    color_val_red_ground: { value: (1) },
    color_val_green_ground: { value: (1) },
    color_val_blue_ground: { value: (1) },
    color_val_r: { value: (50.0) },//controls r,g,b divisor in glsl color function inverse relationship
    color_val_g: { value: (13.0) },
    color_val_b: { value: (10.0) },
    u_time: { type: 'f', value: 5.0 },
    u_height: { type: 'f', value: .2 },
    u_center: { value: drawingCenter },
    u_radius: { type: 'f', value: 200.0 },
    u_step: { type: 'f', value: 1.0 },
    alpha_value: { type: 'f', value: 0.0 },
    screen_scale: { type: 'f', value: scaleBuffer },
    vec_x: { type: 'f', value: 0.0 },
    vec_y: { type: 'f', value: 0.0 },
    center_div: { type: 'f', value: 4.0 },
    cvec_x: { type: 'f', value: 0.0 },
    cvec_y: { type: 'f', value: 0.0 },
    stop_res:{type: 'f', value: stopRes},
    mouse_angle:{type: 'f', value: 0},
    light_pos: {value: new Vector3(1000, -1000, 900)}

};

const lineMaterialunroll= new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: brokenLinecode,
    vertexShader: unrollShader,
    transparent: true,


});

lineMaterialunroll.blending = THREE.CustomBlending;
lineMaterialunroll.blendingEquation = THREE.AddEquation;
lineMaterialunroll.blendSRC = THREE.SrcAlphaFactor;
lineMaterialunroll.blendDst = THREE.OneMinusConstantAlphaFactor;


const lineMaterialElev = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode,
    vertexShader: elevationShader,
    transparent: true,


});

lineMaterialElev.blending = THREE.CustomBlending;
lineMaterialElev.blendingEquation = THREE.AddEquation;
lineMaterialElev.blendSRC = THREE.SrcAlphaFactor;
lineMaterialElev.blendDst = THREE.OneMinusConstantAlphaFactor;



const lineMaterialSpherical = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode2,
    vertexShader: lineShaderSpherical,
    transparent: true,

});


lineMaterialSpherical.blending = THREE.CustomBlending;
lineMaterialSpherical.blendingEquation = THREE.AddEquation;
lineMaterialSpherical.blendSRC = THREE.SrcAlphaFactor;
lineMaterialSpherical.blendDst = THREE.OneMinusConstantAlphaFactor;

const lineMaterialbroken = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: brokenLinecode2,
    vertexShader: vertexShaderCode,
    transparent: true,

});

lineMaterialbroken.blending = THREE.CustomBlending;
lineMaterialbroken.blendingEquation = THREE.AddEquation;
lineMaterialbroken.blendSRC = THREE.SrcAlphaFactor;
lineMaterialbroken.blendDst = THREE.OneMinusConstantAlphaFactor;


const lineMaterialAlt = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: brokenLinecode,
    vertexShader: vertexShaderObl,
    transparent: true,

});

lineMaterialAlt.blending = THREE.CustomBlending;
lineMaterialAlt.blendingEquation = THREE.AddEquation;
lineMaterialAlt.blendSRC = THREE.SrcAlphaFactor;
lineMaterialAlt.blendDst = THREE.OneMinusConstantAlphaFactor;

const planShaderMaterial = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode,
    vertexShader: unrollShader,
    transparent: true,

});

planShaderMaterial.blending = THREE.CustomBlending;
planShaderMaterial.blendingEquation = THREE.AddEquation;
planShaderMaterial.blendSRC = THREE.SrcAlphaFactor;
planShaderMaterial.blendDst = THREE.OneMinusConstantAlphaFactor;

const elevationShaderMaterial = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode,
    vertexShader: elevationShader,
    transparent: true,

});

elevationShaderMaterial.blending = THREE.CustomBlending;
elevationShaderMaterial.blendingEquation = THREE.AddEquation;
elevationShaderMaterial.blendSRC = THREE.SrcAlphaFactor;
elevationShaderMaterial.blendDst = THREE.OneMinusConstantAlphaFactor;

const sphericalShader = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode2,
    vertexShader: lineShaderSpherical,
    transparent: true,

});

const shadowShaderMat = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode2,
    vertexShader: shadowShader,
    transparent: true,

});


sphericalShader.blending = THREE.CustomBlending;
sphericalShader.blendingEquation = THREE.AddEquation;
sphericalShader.blendSRC = THREE.SrcAlphaFactor;
sphericalShader.blendDst = THREE.OneMinusConstantAlphaFactor;


const elevationShaderMaterialRt = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode,
    vertexShader: elevationShaderRt,
    transparent: true,

});

elevationShaderMaterialRt.blending = THREE.CustomBlending;
elevationShaderMaterialRt.blendingEquation = THREE.AddEquation;
elevationShaderMaterialRt.blendSRC = THREE.SrcAlphaFactor;
elevationShaderMaterialRt.blendDst = THREE.OneMinusConstantAlphaFactor;


const elevationShaderMaterialLt = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode,
    vertexShader: elevationShaderLt,
    transparent: true,

});

elevationShaderMaterialLt.blending = THREE.CustomBlending;
elevationShaderMaterialLt.blendingEquation = THREE.AddEquation;
elevationShaderMaterialLt.blendSRC = THREE.SrcAlphaFactor;
elevationShaderMaterialLt.blendDst = THREE.OneMinusConstantAlphaFactor;

const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode,
    vertexShader: vertexShaderCode,
    transparent: true,


});

shaderMaterial.blending = THREE.CustomBlending;
shaderMaterial.blendingEquation = THREE.AddEquation;
shaderMaterial.blendSRC = THREE.SrcAlphaFactor;
shaderMaterial.blendDst = THREE.OneMinusConstantAlphaFactor;


const shaderMaterialPlane = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragShaderPlane,
    vertexShader: vertexShaderCode,



});



const shaderObl = new THREE.ShaderMaterial({
    uniforms: shadUniform,
    fragmentShader: fragmentShaderCode,
    vertexShader: vertexShaderObl,

});

shaderObl.blending = THREE.CustomBlending;
shaderObl.blendingEquation = THREE.AddEquation;
shaderObl.blendSRC = THREE.SrcAlphaFactor;
shaderObl.blendDst = THREE.OneMinusConstantAlphaFactor;

let btn = document.querySelector('#btn');

const geoPlane = new THREE.PlaneGeometry(10000000, 10000000);
const ground = new THREE.Mesh(geoPlane, shaderMaterialPlane)
ground.position.z = -5000.0;

const geometry = new THREE.CircleGeometry(50, 32 ); 
const material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
const circle = new THREE.Mesh( geometry, planShaderMaterial); 
//scene.add( circle );


const RoundThing1 = new RoundObject();
const RoundThing2 = new RoundObject();
const RoundThing3 = new RoundObject();
const RoundThing4 = new RoundObject();
const RoundThing5 = new RoundObject();
const RoundThing6 = new RoundObject();


RoundThing1.setProjection('ThreeD');
RoundThing2.setProjection('ThreeD');
RoundThing3.setProjection('ThreeD');
RoundThing4.setProjection('ThreeD');
RoundThing5.setProjection('ThreeD');
RoundThing6.setProjection('ThreeD');

RoundThing1.setMax(max);
RoundThing2.setMax(max);
RoundThing3.setMax(max);
RoundThing4.setMax(max);
RoundThing5.setMax(max);
RoundThing6.setMax(max)


var colorValue = [255, 255, 255];

let center = [0,0,0]

for (let i = 0; i < maxPoints; i++) {
    RoundThing1.conicPoints(5, 4, radius,i, center , colorValue, true)
    RoundThing2.conicPoints(5, 4, radius*.6, i, center , colorValue, true)
    RoundThing3.conicPoints(5, 4, radius,i, center , colorValue, true)
    RoundThing4.conicPoints(9, 2, radius,i, center , colorValue, true)
    RoundThing5.conicPoints(9, 2, radius*.6,i, center , colorValue, true)
    RoundThing6.conicPoints(9, 2, radius,i, center , colorValue, true)
    }



var outerPoints1 = RoundThing1.getPointArray();
var innerPoints2 = RoundThing2.getPointArray();

var outerPoints3 = RoundThing4.getPointArray();
var innerPoints4 = RoundThing5.getPointArray();


var polyPoints1 = RoundThing1.getPointsXYZ();
var polyPoints2 = RoundThing2.getPointsXYZ();
var polyPoints3 = RoundThing3.getPointsXYZ();
var polyPoints4 = RoundThing4.getPointsXYZ();
var polyPoints5 = RoundThing5.getPointsXYZ();
var polyPoints6 = RoundThing6.getPointsXYZ();


var poly1 = polyline(polyPoints1, bColor, 1.0, true)
var poly2 = polyline(polyPoints2, bColor, 1.0, true)
var poly3 = polyline(polyPoints3, [0, 0, 0], 1.0, true)
var poly4 = polyline(polyPoints4, [0, 0, 0], 1.0, true)
var poly5 = polyline(polyPoints5, [0, 0, 0], 1.0, true)
var poly6 = polyline(polyPoints6, [0, 0, 0], 1.0, true)




const sMesh2 = surfaceFromPoints(outerPoints3, innerPoints4, false);
const sMesh = surfaceFromPoints(outerPoints1, innerPoints2, false);


for (let i = 0; i < sMesh.length; i++) {
    scene.add(sMesh2[i], sMesh[i])
}
for (let i = 0; i < poly1.length; i++) {
    scene.add(poly1[i], poly2[i], poly3[i], poly4[i], poly5[i],poly6[i])
}

if (groundPlane === true){scene.add(ground)};



animate();

//.............................................Animation and Drawing

count = 0;

function animate() {
    stp += 1;
    if (stp == stpVal) { renderVal = true; }
    if (stp < stpVal) { requestAnimationFrame(animate) }
   
    



    // if (renderScale <=1.5){renderScale+=resInc}

    let resAngle = Math.sin(DegToRad(stp/10000)) ;

    //renderScale = linearLoopCounter(stopRes, resInc);
    
    camera.aspect = window.innerHeight/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( windowX, windowY );

    //renderer.setPixelRatio(window.devicePixelRatio * renderScale)
    
    

    console.log(window.devicePixelRatio)


    //console.log(renderScale)



    // required if controls.enableDamping or controls.autoRotate are set to true
    //controls.update();


    if (sMesh) {

        for (let i = 0; i < sMesh.length; i++) {
            sMesh[i].rotation.x += rotInc;
            sMesh2[i].rotation.x -= rotInc;
            sMesh[i].rotation.y += rotInc;
            sMesh2[i].rotation.y -= rotInc;
            sMesh[i].rotation.z += rotInc;
            sMesh2[i].rotation.z += rotInc;
            sMesh2[i].position.x = objectCenter.x;
            sMesh[i].position.x = objectCenter.x;
            sMesh2[i].position.y = objectCenter.y;
            sMesh[i].position.y = objectCenter.y;
        }
        for (let i = 0; i < poly1.length; i++) {
            poly1[i].rotation.x -= rotInc;
            poly2[i].rotation.x -= rotInc;
            poly3[i].rotation.x -= rotInc;
            poly4[i].rotation.x -= rotInc;
            poly5[i].rotation.z -= rotInc;
            poly6[i].rotation.z -= rotInc;

            poly1[i].rotation.z += rotInc;
            poly2[i].rotation.z += rotInc;
            poly3[i].rotation.z += rotInc;
            poly4[i].rotation.y = rotInc;
            poly5[i].rotation.y -= rotInc;
            poly6[i].rotation.y += rotInc;

            poly1[i].position.x = objectCenter.x;
            poly2[i].position.x = objectCenter.x;
            poly3[i].position.x = objectCenter.x;
            poly4[i].position.x = objectCenter.x;
            poly5[i].position.x = objectCenter.x;
            poly6[i].position.x = objectCenter.x;

            poly1[i].position.y = objectCenter.y;
            poly2[i].position.y = objectCenter.y;
            poly3[i].position.y = objectCenter.y;
            poly4[i].position.y = objectCenter.y;
            poly5[i].position.y = objectCenter.y;
            poly6[i].position.y = objectCenter.y*6;
            poly6[i].position.z = objectCenter.z;
        }


        var degrees = renderScale*20;

    }
    document.addEventListener('mousemove', function (clientX) {
        var mouseAngle = mouseCoordinates();

        if (circle){
        circle.position.x = mouseAngle[0];
        circle.position.y = mouseAngle[1];
        circle.position.z = 1800;}

        shadUniform.mouse_angle.value = Math.atan2(mouseAngle[1], mouseAngle[0]);



        



    



        shadUniform.cvec_x.value =mouseAngle[0]
        shadUniform.cvec_y.value = mouseAngle[1]

        //console.log(shadUniform.cvec_y.value)





    })

    let shaderVectors = vectorAngle(degrees);

    shadUniform.vec_x.value = shaderVectors[0];
    shadUniform.vec_y.value = shaderVectors[1];

    shadUniform.color_val_r.value -= resInc/2*colorInc.r;
    shadUniform.color_val_g.value -= resInc/2*colorInc.g;
    shadUniform.color_val_b.value -= resInc/2*colorInc.b;

    shadUniform.u_resolution.value.x += resAdd.x;
    shadUniform.u_resolution.value.y += resAdd.y;

;



    shadUniform.u_time.value = radialLoopCounter(shadUniform.u_time.value, 360.0, resInc);
    shadUniform.center_div.value = radialLoopCounter(shadUniform.center_div.value, 8.0, resInc);


    shadUniform.u_height.value += 1.0;
    if (shadUniform.u_height.value >= 100) {
        shadUniform.u_height.value -= 1.0;

    }


    shadUniform.u_radius.value += 0.1;

    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
    render((renderVal), renderer, 720);



    if (enableSaveFrame == true) {
        document.addEventListener("click", function (render) {
            console.log("frame saved");
            render((true), renderer, 720);
        });
    }


}

function mouseCoordinates() {

    let x = (event.clientX  -(windowX/window.devicePixelRatio +1))*(windowX /75) *renderScale;
    let y = -(event.clientY -(windowY/window.devicePixelRatio -1))*(windowY/75) *renderScale;

    //let x = clientX;
    //let y = clinetY;
    

    

    return [x, y]
}




function Click() {

    console.log('true');
}


function frameCounter() {

    let val = requestAnimationFrame(frameCounter);

    return val
}

function stopCounter(start, stop, step) {
    let count = start;
    count += step;
    if (count = stop) {
        return count
    }
    return count
}

function radialLoopCounter(mini, maxi, inc) {
    if (count2 < maxi){count2 += inc}
    if (count2 >= maxi){count2 = mini}
   return count2
  }
  

function vectorAngle(angle) {
    let radVal = DegToRad(angle);
    let x = Math.cos(radVal)
    let y = Math.sin(radVal)

    return [x, y]
}

function linearLoopCounter(maxi, inc) {

    if (count < maxi) { count += inc }
    if (count >= maxi) { count = -count }
    return Math.abs(count)
}




// functions


function setRGB(red, green, blue) {
    return "rgb" + "(" + String(red) + "," + String(green) + "," + String(blue) + ")";
}

function renderOnClick() {

    var imgData = renderer.domElement.toDataURL({ pixelRatio: 1.0 }).replace("image/png", "image/octet-stream");
    let link = document.createElement('a');
    let num = count += 1;
    let fileName = num.toString().padStart(4, '0') + '.png'
    link.href = imgData;
    link.download = fileName;

}






function render(renderImage, renderer, recordStop) {
    if (renderImage == true) {
        var imgData = renderer.domElement.toDataURL({ pixelRatio: 1.0 }, {alpha: false}).replace("image/png", "image/octet-stream");
        let link = document.createElement('a');
        let num = fcount += 1;
        let fileName = num.toString().padStart(4, '0') + '.png';
        link.href = imgData;
        link.download = fileName;
        link.click();
        if (num >= recordStop) {
            renderImage = false;
        }
    }
}

function polyline(pointList, colorVal, lineWght, obliqueTransform) {
    let col = setRGB(colorVal[0], colorVal[1], colorVal[2])
    var pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setFromPoints(pointList);
    pointGeometry.computeVertexNormals();
    if (obliqueTransform == true) {

        var name = 'test' + String(1);

        var poly2 = new THREE.Line(pointGeometry, lineMaterialunroll);
        var poly3 = new THREE.Line(pointGeometry, lineMaterialElev);
        var poly4 = new THREE.Line(pointGeometry, elevationShaderMaterialRt);
        var poly6 = new THREE.Line(pointGeometry, elevationShaderMaterialLt);
        var poly5 = new THREE.Line(pointGeometry, lineMaterialSpherical);
        var poly7 = new THREE.Line(pointGeometry, shaderObl);
        var lineMaterial = new THREE.LineBasicMaterial({ color: col, linewidth: lineWght });
        var poly = new THREE.Line(pointGeometry, lineMaterialbroken);

        //scene.add(poly2, poly3, poly4,poly5,poly6)
        return ([poly, poly2, poly3, poly4, poly5, poly6, poly7])

    }
    else {
        var lineMaterial = new THREE.LineBasicMaterial({ color: col, linewidth: lineWght });
        var poly = new THREE.Line(pointGeometry, lineMaterial);
    }

    return poly

}


function lineSurface(pointArray1, pointArray2) {
    var lineMaterial = new THREE.LineBasicMaterial({ color: (0, 0, 0), linewidth: .1 });
    //var reversed = pointArray2.reverse();

    var lines = [];
    for (let i = 0; i <= pointArray1.length - 1; i++) {
        var geometry = new THREE.BufferGeometry().setFromPoints([pointArray1[i], pointArray2[i]]);
        var line = new THREE.Line(geometry, lineMaterial);

        scene.add(line)
        //lines.push(line)


    }

}
function surfaceFromPoints(pointArray1, pointArray2, wireFrame) {
    //builds a mesh surface from two sets of equal number vertices 

    var geometries = [];
    for (let i = 0; i <= pointArray1.length - 1; i++) {


        var geometry = new THREE.BufferGeometry();
    
        

        if (pointArray1[i + 1] && pointArray2[i + 1]) {
            // create array with with points to creat the outer edges of two triangles
            var vertices = new Float32Array([

                pointArray1[i][0], pointArray1[i][1], pointArray1[i][2], //0
                pointArray1[i + 1][0], pointArray1[i + 1][1], pointArray1[i + 1][2],//1
                pointArray2[i + 1][0], pointArray2[i + 1][1], pointArray2[i + 1][2],//2
                pointArray2[i][0], pointArray2[i][1], pointArray2[i][2],//3        

            ]);
            // order the indices othe array so that the program reuses the points that are shared between triangles. 
            var indices = [
                0, 1, 2,
                2, 3, 0,
            ];

            geometry.setIndex(indices);
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

            geometries.push(geometry);


        }

        //var merge = BufferGeometryUtils.mergeGeometries(geometries, true);
        var mergGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);

        mergGeometry.computeVertexNormals();
        
        if (wireFrame == true) {
            var wireframe = new THREE.WireframeGeometry(geometry);
            var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: .01 });
            var line = new THREE.LineSegments(wireframe, lineMaterial);
            line.material.depthTest = false;
            line.material.opacity = 1.0;
            line.material.transparent = false;
            scene.add(line);
        }

    }

    var material = [shaderMaterial, shaderObl, planShaderMaterial, elevationShaderMaterial];
    const mesh = new THREE.Mesh(mergGeometry, shaderMaterial)
    const mesh2 = new THREE.Mesh(mergGeometry, shaderObl)
    const mesh3 = new THREE.Mesh(mergGeometry, planShaderMaterial)
    const mesh4 = new THREE.Mesh(mergGeometry, elevationShaderMaterial)
    const mesh5 = new THREE.Mesh(mergGeometry, elevationShaderMaterialRt)
    const mesh6 = new THREE.Mesh(mergGeometry, elevationShaderMaterialLt)
    const mesh7 = new THREE.Mesh(mergGeometry, sphericalShader)
    const mesh8 = new THREE.Mesh(mergGeometry, lineMaterialElev)
    const mesh9 = new THREE.Mesh(mergGeometry, shadowShaderMat)


    //scene.add (mesh, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7)
    return ([mesh, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7, mesh8,mesh9])
}

function remap(value, sourceMin, sourceMax, targetMin, targetMax) {
    var source = sourceMax - sourceMin;
    var target = targetMax - targetMin;
    var valueLess = value - sourceMin;

    var newValue = (target * valueLess / source) + targetMin
    return newValue
}

function clamp(value, floor, ceiling) {
    if (value < floor) {
        return floor
    }
    if (value > ceiling) {
        return ceiling
    }

    else {
        return value
    }
}

function pointToRgb(point, min, max) {
    var x = point[0]
    var y = point[1]
    var z = point[2]

    var r = parseInt(clamp(remap(x, min, max, 0, 255)))
    var g = parseInt(clamp(remap(y, min, max, 0, 255)))
    var b = parseInt(clamp(remap(z, min, max, 0, 255)))

    return [r, g, b]
}

function distancePoints(pointA, pointB) {

    let x1 = pointA[0];
    let y1 = pointA[1];
    let z1 = pointA[2];

    let x2 = pointB[0];
    let y2 = pointB[1];
    let z2 = pointB[2];

    let xDiff = (x2 - x1) * (x2 - x1);
    let yDiff = (y2 - y1) * (y2 - y1);
    let zDiff = (z2 - z1) * (z2 - z1);

    let sumDiff = xDiff + yDiff + zDiff;

    return Math.sqrt(sumDiff);

}

function DegToRad(degrees) {

    var pi = Math.PI;
    return degrees * (pi / 180)
}
function chunkArray(chunkSize, arrayName) {
    let chunkedArray = [];
    for (let i = 0; i < arrayName.length; i += chunkSize) {
        const chunk = arrayName.slice(i, i + chunkSize);
        chunkedArray.push(chunk)
    }

    return chunkedArray
}

function labelPoints(points, parent) {
    for (let i = 0; i < points.length; i++) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = i;
        labelDiv.style.backgroundColor = 'transparent';
        var pointLabel = new CSS2DObject(labelDiv);
        let px = points[i][0];
        let py = points[i][1];
        let pz = points[i][2];
        pointLabel.position.set(px, py, pz);
        parent.add(pointLabel);
    }

}


