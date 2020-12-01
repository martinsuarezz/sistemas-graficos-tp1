class Flap extends Objeto3D{
    constructor(){
        super();
        let flapForm = new Forma();
        flapForm.load2DSvgString("M -2 4 C -2.646 3.793 1.3 -4.731 2 -5 C 3.262 -5.385 5.29 -5.233 6 -5 C 6.576 -4.731 2.63 3.749 2 4 C 1.3 4.316 -1.207 4.316 -2 4", [0,0,1]);
        let flapPath = new Forma();
        flapPath.load2DSvgString("M 0 0 L 0 2", [0,1,0]);
        let flapSurface = new SweptSurface(flapForm, flapPath, 50, 2, true);
        this.setGeometry(flapSurface.positionBuffer, flapSurface.indexBuffer, flapSurface.normalBuffer);
    }
}
