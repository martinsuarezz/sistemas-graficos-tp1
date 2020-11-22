var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var vec4=glMatrix.vec4;

var gl = null,
canvas = null,

glProgram = null,
fragmentShader = null,
vertexShader = null;
    
var vertexPositionAttribute = null,
trianglesVerticeBuffer = null,
vertexNormalAttribute = null,
trianglesNormalBuffer = null,
trianglesIndexBuffer = null;
    
var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;

var cabin = new Cabin();
var bar = new Cylinder();

function initWebGL(){

    canvas = document.getElementById("my-canvas");  

    try{
        gl = canvas.getContext("webgl");      
    }catch(e){
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

    if(gl) {

        setupWebGL();
        initShaders();
        setupBuffers();
        setupVertexShaderMatrix();
        tick();   

    }else{    
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

}


function setupWebGL(){
    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);     
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, 100.0);
    
    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix,modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

    mat4.identity(viewMatrix);
    //mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -5.0]);
    
}
        
        
function initShaders() {
    //get shader source
    var fs_source = document.getElementById('shader-fs').innerHTML,
        vs_source = document.getElementById('shader-vs').innerHTML;

    //compile shaders    
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
    
    //create program
    glProgram = gl.createProgram();
    
    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }
    
    //use program
    gl.useProgram(glProgram);
}

function makeShader(src, type){
    //compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function getPos(alfa,beta){

    var r=2;
    var nx=Math.sin(beta)*Math.sin(alfa);
    var ny=Math.sin(beta)*Math.cos(alfa);
    var nz=Math.cos(beta);


    var g=beta%0.5;
    var h=alfa%1;
    var f=1;

    if (g<0.25) f=0.95;
    if (h<0.5) f=f*0.95;
    
    var x=nx*r*f;
    var y=ny*r*f;
    var z=nz*r*f;

    return [x,y,z];
}

function getNrm(alfa,beta){
    var p=getPos(alfa,beta);
    var v=vec3.create();
    vec3.normalize(v,p);

    var delta=0.05;
    var p1=getPos(alfa,beta);
    var p2=getPos(alfa,beta+delta);
    var p3=getPos(alfa+delta,beta);

    var v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
    var v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);

    vec3.normalize(v1,v1);
    vec3.normalize(v2,v2);
    
    var n=vec3.create();
    vec3.cross(n,v1,v2);
    vec3.scale(n,n,-1);
    return n;
}

function setupBuffers()
{
    var pos=[];
    var normal=[];
    var r=2;
    var rows=128;
    var cols=256;

    for (var i=0;i<rows;i++){
        for (var j=0;j<cols;j++){

            var alfa=j/(cols-1)*Math.PI*2;
            var beta=(0.1+i/(rows-1)*0.8)*Math.PI;

            var p=getPos(alfa,beta);

            pos.push(p[0]);
            pos.push(p[1]);
            pos.push(p[2]);

            var n=getNrm(alfa,beta);

            normal.push(n[0]);
            normal.push(n[1]);
            normal.push(n[2]);
        }

    }

    var index=[];

    for (var i=0;i<rows-1;i++){
        index.push(i*cols);
        for (var j=0;j<cols-1;j++){
            index.push(i*cols+j);
            index.push((i+1)*cols+j);
            index.push(i*cols+j+1);
            index.push((i+1)*cols+j+1);
        }
        index.push((i+1)*cols+cols-1);
    }

}

function setupVertexShaderMatrix(){
    //var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    //gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}                  

function drawScene(){

    setupVertexShaderMatrix();
    /*
    bar.setEscala(0.4);
    bar.setPosicion(0,0,0);
    bar.setRotacion(Math.PI/2, 0,0,1);
    bar.dibujar();
    */
    cabin.setEscala(0.2);
    cabin.setPosicion(0,0,0);
    cabin.setRotacion(Math.PI/2,0,0,1);

    cabin.dibujar();
}

function animate(){
    
    rotate_angle += 0.01;
    let xCamara = radio * Math.sin(phi) * Math.sin(theta);
    let yCamara = radio * Math.cos(phi);
    let zCamara = radio * Math.sin(phi) * Math.cos(theta);
    mat4.lookAt(viewMatrix, [xCamara, yCamara, zCamara], [0,0,0], [0,1,0]);
    
    mat4.identity(modelMatrix);
    //mat4.rotate(modelMatrix,modelMatrix, rotate_angle, [1.0, 0.0, 1.0]);

    mat4.identity(normalMatrix);
    mat4.multiply(normalMatrix,viewMatrix,modelMatrix);
    mat4.invert(normalMatrix,normalMatrix);
    mat4.transpose(normalMatrix,normalMatrix);

}

function tick(){

    requestAnimationFrame(tick);
    drawScene();
    animate();
}

window.onload=initWebGL;