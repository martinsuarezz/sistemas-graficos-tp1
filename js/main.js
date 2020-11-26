var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var vec4=glMatrix.vec4;

var gl = null,
canvas = null,

glProgram = null,
glProgram2 = null,
fragmentShader = null,
vertexShader1 = null,
vertexShader2 = null;
    /*
var vertexPositionAttribute = null,
trianglesVerticeBuffer = null,
vertexNormalAttribute = null,
trianglesNormalBuffer = null,
trianglesIndexBuffer = null;
    */
var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;

//var cabin = new Cabin();
//var bar = new Cylinder();
var skid1, cabin, helicopter, aux;
var controller = new Controller();

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
        createObjects();
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
        fs_source2 = document.getElementById('terrain-fs').innerHTML,
        vs_source1 = document.getElementById('shader-vs').innerHTML,
        vs_source2 = document.getElementById('terrain-vs').innerHTML;

    //compile shaders    
    vertexShader1 = makeShader(vs_source1, gl.VERTEX_SHADER);
    vertexShader2 = makeShader(vs_source2, gl.VERTEX_SHADER);
    fragmentShader1 = makeShader(fs_source, gl.FRAGMENT_SHADER);
    fragmentShader2 = makeShader(fs_source2, gl.FRAGMENT_SHADER);
    
    //create programs
    glProgram = gl.createProgram();
    glProgram2 = gl.createProgram();
    
    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader1);
    gl.attachShader(glProgram, fragmentShader1);
    gl.linkProgram(glProgram);

    gl.attachShader(glProgram2, vertexShader2);
    gl.attachShader(glProgram2, fragmentShader2);
    gl.linkProgram(glProgram2);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program 1.");
    }

    if (!gl.getProgramParameter(glProgram2, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(glProgram2))
        alert("Unable to initialize the shader program 2.");
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

function createObjects(){
    skid1 = new SkidLowerPart();
    aux = new Blade();
    cabin = new Cabin();
    helicopter = new Helicopter();
    terrain = new Terrain(50, 200, 200);
    terrain.initTexture("img/heightmap.png");
    terrain.initBuffers();
}

function setupVertexShaderMatrix(){
    gl.useProgram(glProgram);
    //var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    //gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    gl.useProgram(glProgram2);

    var modelMatrixUniform = gl.getUniformLocation(glProgram2, "modelMatrix");
    var viewMatrixUniform2  = gl.getUniformLocation(glProgram2, "viewMatrix");
    var projMatrixUniform2  = gl.getUniformLocation(glProgram2, "projMatrix");
    var normalMatrixUniform2 = gl.getUniformLocation(glProgram2, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform2, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform2, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform2, false, normalMatrix);

    gl.useProgram(glProgram);
}                  

function drawScene(){
    var position = controller.getHelicopterPosition();
    var rotation = controller.getHelicopterRotation();

    setupVertexShaderMatrix();
    //aux.draw();
    
    helicopter.setScale(0.3);
    helicopter.setRotation(...rotation);
    helicopter.setPosition(...position);

    helicopter.draw();
    /*
    cabin.dibujar();
    
    skid1.setEscala(0.3);
    skid1.dibujar();
    */
    //helicopter.draw();
    
    //terrain.draw();
}

function animate(){
    rotate_angle += 0.01;
    let cameraPosition = controller.getCameraPosition();
    let cameraTarget = controller.getCameraTarget();
    mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, [0, 1, 0]);
    
    mat4.identity(modelMatrix);
    //mat4.rotate(modelMatrix,modelMatrix, rotate_angle, [1.0, 0.0, 1.0]);

    mat4.identity(normalMatrix);
    mat4.multiply(normalMatrix,viewMatrix,modelMatrix);
    mat4.invert(normalMatrix,normalMatrix);
    mat4.transpose(normalMatrix,normalMatrix);

}

function tick(){
    requestAnimationFrame(tick);
    controller.tick();
    drawScene();
    animate();
}

window.onload=initWebGL;