class Camera extends Objeto3D{
    constructor(visible = false){
        super();
        if (visible){
            let bladeForm = new Forma();
            bladeForm.load2DSvgString("M 0 -1.4 L 0.8 -1.4 L 0.6 0 L 0 0 L 0 -1.4", [0,0,1]);
            let bladePath = new Forma();
            bladePath.load2DSvgString("M 0 -0.1 L 0 0", [0,1,0]);
            let bladeSurface = new SweptSurface(bladeForm, bladePath, 10, 2, true);
            this.setGeometry(bladeSurface.positionBuffer, bladeSurface.indexBuffer, bladeSurface.normalBuffer);
        }
    }
}