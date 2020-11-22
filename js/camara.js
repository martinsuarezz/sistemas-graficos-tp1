var mouseDown = false;
var xMouse = 0;
var yMouse = 0;

var theta = 0;
var phi = Math.PI/2;
var radio = 5;
var radioMin = 2;
var radioMax = 15;

var velocidadCamara = 0.01;
var velocidadScroll = 0.005;

var scene = document.getElementById('my-canvas');

scene.addEventListener('mousedown', e => {
    xMouse = e.offsetX;
    yMouse = e.offsetY;
    mouseDown = true;
});

scene.addEventListener('mousemove', e => {
    if (mouseDown){
        theta -= (e.offsetX - xMouse) * velocidadCamara;
        phi -= (e.offsetY - yMouse) * velocidadCamara;
        xMouse = e.offsetX;
        yMouse = e.offsetY;

        if (phi <= 0)
            phi = 0.01; // no anda si llega a 0
        if (phi > Math.PI)
            phi = Math.PI;
    }
})

scene.addEventListener('wheel', e => {
    radio += e.deltaY * velocidadScroll;
    if (radio < radioMin)
        radio = radioMin;
    if (radio > radioMax)
        radio = radioMax;
})

window.addEventListener('mouseup', e => {
    mouseDown = false;
})