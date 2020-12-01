class Box extends Objeto3D{
    constructor(){
        super();
        let boxForm = new Forma();
        boxForm.load2DSvgString("M -2 -2 L -2 2 L 2 2 L 2 -2 L -2 -2", [0,0,1]);
        let boxPath = new Forma();
        boxPath.load2DSvgString("M 0 0 L 0 2", [0,1,0]);
        let boxSurface = new SweptSurface(boxForm, boxPath, 4, 2, true);
        this.setGeometry(boxSurface.positionBuffer, boxSurface.indexBuffer, boxSurface.normalBuffer);
    }
}
