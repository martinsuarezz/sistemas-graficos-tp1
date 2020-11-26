class Blade extends Objeto3D{
    constructor(){
        super();
        let bladeForm = new Forma();
        bladeForm.load2DSvgString("M 0 -1.4 L 0.8 -1.4 L 0.6 0 L 0 0 L 0 -1.4", [0,0,1]);
        bladeForm.getPoint(0);
        bladeForm.getPoint(0.1);
        bladeForm.getPoint(0.25);
        bladeForm.getPoint(0.3);
        //bladeForm.load2DSvgString("M 0 0 C 0 -1 -1 -4 0 -4 C 1 -4 1 -5 1 -4 C 0.6667 -2.6667 1 0 0 0", [0,0,1]);
        let bladePath = new Forma();
        bladePath.load2DSvgString("M 0 -0.02 L 0 0", [0,1,0]);
        let bladeSurface = new SweptSurface(bladeForm, bladePath, 10, 2, true);
        this.setGeometry(bladeSurface.positionBuffer, bladeSurface.indexBuffer, bladeSurface.normalBuffer);
    }
}