import * as THREE from 'three'


class RoundObject {
    constructor() {
        
        this.rotValue = 0.0;
        this.centerX = 0.0;
        this.centerY = 0.0;
        this.centerZ = 0.0;


        this.pointX = 0.0;
        this.pointY = 0.0;
        this.pointZ = 0.0;

        this.OblAngle = 0.0;


        //this.pointPos;

        this.pointPos = new THREE.Vector3(this.pointX, this.pointY, this.pointZ);

        this.pointsXYZ = [];
        this.numberPoints = [];
        this.rotatePoints = [];
        this.pointCoord = [];

        this.r = 0.0;
        this.g = 0.0
        this.b = 0.0

    }

    getpointCoord() {
        return this.pointCoord
    }

    getRotatePoints() {
        return this.rotatePoints
    }

    getPointsXYZ() {
        return this.pointsXYZ
    }

    updateUniform(value) {
        shadUniform.u_time.value += value;
    }


    getPointArray() {
        return this.numberPoints;
    }

    getCenter() {
        return [this.centerX, this.centerY, this.centerZ];
    }

    setMax(maximum) {

        this.max = maximum;
    }

    setProjection(Projection) {

        this.Projection = Projection
    }

    setRadiusFactor(factor) {
        this.RadiusFactor = RadiusFactor;
    }



    setPolyWeight(wght) {

        this.polyWeight = wght
    }

    updatehorAngle(hor){
        this.horAngle += hor;
    }

    conicPoints(horAngle, step, radius, rotation, centerPoint, color) {

        this.centerX = centerPoint[0];
        this.centerY = centerPoint[1];
        this.centerZ = centerPoint[2];


        this.r = color[0];
        this.g = color[1];
        this.b = color[2];

        let hght =  radius * 2.0

        this.coneStep = step

        if (this.Projection == "ThreeD") {
        for (let i = 1; i < rotation; i++) {

            let hor = DegToRad(360/horAngle *i) ;
            let ver = DegToRad((hght/Math.abs(step) ) * i );

            this.pointX = (hght - this.coneStep) / hght * radius * Math.cos(hor) + this.centerX;
            this.pointY = (hght- this.coneStep) / hght * radius * Math.sin(hor) + this.centerY;
            this.pointZ = ver;

           }
            
        }

        if (radius > this.max) {
            var center2 = [this.pointX + radius, this.pointY -radius, this.pointZ]
            this.conicPoints(horAngle *2.0, this.coneStep, radius / 1.5, rotation + 50, center2, [12, 59, 101])
            this.conicPoints(horAngle *2.0, this.coneStep , radius /3.0, rotation + 20, center2, [12, 59, 101])
            
            
            this.pointPos = new THREE.Vector3(this.pointX, this.pointY, this.pointZ);
            this.pointsXYZ.push(this.pointPos);
            this.pointCoord.push([this.pointX, this.pointY, this.pointZ]);
            this.numberPoints.push([this.pointX, this.pointY, this.pointZ])


        }
    }
    spherePoints(horAngle, verAngle, radius, rotation, centerPoint, color) {

        this.centerX = centerPoint[0];
        this.centerY = centerPoint[1];
        this.centerZ = centerPoint[2];


        this.r = color[0];
        this.g = color[1];
        this.b = color[2];

    
        for (let i = 1; i < rotation; i++) {

            let hor = DegToRad(horAngle * i);
            let ver = DegToRad(verAngle * i);

            if (this.Projection == "ThreeD") {
                this.pointX = (Math.cos(hor) * radius * Math.sin(ver) + this.centerX);
                this.pointY = (Math.sin(hor) * radius * Math.sin(ver) + this.centerY);
                this.pointZ = Math.cos(ver) * radius + this.centerZ;
            }

            if (this.Projection == "Oblique") {

                oblStep += 0.2

                let px = (Math.cos(hor) * radius * Math.sin(ver) + this.centerX)
                let py = (Math.sin(hor) * radius * Math.sin(ver) + this.centerY)
                var newPoint = ProjectDistance([px, py, 0.0], this.OblAngle, oblStep)
                this.pointX = newPoint[0]
                this.pointY = newPoint[1]
                this.pointZ = 0.0;


            }




        }




        //this.pointsXYZ.push(this.pointPos);

        if (radius > this.max) {
            var center2 = [this.pointX, this.pointY, this.pointZ]
            this.spherePoints(horAngle * 2, verAngle, radius / 2, rotation, center2, [12, 59, 101])
            this.spherePoints(horAngle * 3, verAngle, radius / 3, rotation, center2, [12, 59, 101])
      
 
            this.pointPos = new THREE.Vector3(this.pointX, this.pointY, this.pointZ);
            this.pointsXYZ.push(this.pointPos);
            this.pointCoord.push([this.pointX, this.pointY, this.pointZ]);
            this.numberPoints.push([this.pointX, this.pointY, this.pointZ])


        }


    }
}
export { RoundObject }



function frameCounter() {

    let val = requestAnimationFrame(frameCounter);

    return val
}



// functions
function setRGB(red, green, blue) {
    return "rgb" + "(" + String(red) + "," + String(green) + "," + String(blue) + ")";
}

function render() {
    renderer.render(scene, camera);
    console.log("hello");
}





function updateMaterial(mesh) {


    mesh.shaderObl.shadUniform.u_time.value += 1.0;
    requestAnimationFrame(updateUniforms);
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
function surfaceFromPoints(pointArray1, pointArray2, texture, wireFrame) {
    //builds a mesh surface from two sets of equal number vertices 



    const shadUniform = {
        u_resolution: { value: new Vector2(window.innerWidth * 2, window.innerHeight * 2) },
        hatch_density: { value: (window.innerWidth) },
        color_val_red: { value: (50.0) },
        color_val_green: { value: (50.0) },
        color_val_blue: { value: (50.0) },
        u_time: { type: 'f', value: 1.0 },
    };


    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: shadUniform,
        fragmentShader: fragmentShaderCode,
        vertexShader: vertexShaderCode,


    });

    const shaderObl = new THREE.ShaderMaterial({
        uniforms: shadUniform,
        fragmentShader: fragmentShaderCode,
        vertexShader: vertexShaderObl,

    });




    shaderMaterial.side = THREE.DoubleSide;

    var geometries = [];
    for (let i = 0; i <= pointArray1.length - 1; i++) {


        var geometry = new THREE.BufferGeometry();


        if (pointArray1[i + 1] && pointArray2[i + 1]) {
            // creatw array with with points to creat the outer edges of two triangles
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

            geometries.push(geometry)

            var mesh = new THREE.Mesh(geometry, shaderMaterial)
            var mesh2 = new THREE.Mesh(geometry, shaderObl)

            //mesh2.rotation.z += frameFlt;
            //mesh2.updateMatrix
            var val = frameCounter();
            //mesh2.rotation.y += val
            //mesh2.rotation.x += val
            scene.add(mesh, mesh2);






            //mesh2.material.needsUpdate = true;
            //mesh2.material.uniforms.u_time.value = frameFlt/10.0;

        }

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

function ProjectDistance(point, angle, distance) {
    let pX = point[0];
    let pY = point[1];
    let pZ = point[2];

    let pAngle = DegToRad(angle)

    var pXnew = Math.cos(pAngle) * distance + pX;
    var pYnew = Math.sin(pAngle) * distance + pY;
    var pZnew = pZ

    return [pXnew, pYnew, pZnew]

}


function rotatePoint(center, point, angle) {
    let centerX = center[0];
    let centerY = center[1];
    let centerZ = center[2];

    let px = point[0];
    let py = point[1];
    let pz = point[2];

    let pAngle = DegToRad(angle)

    var pXnew = Math.cos(pAngle) + px;
    var pYnew = Math.sin(pAngle) + py;
    var pZnew = pz

    return pXnew, pYnew, pZnew

}
