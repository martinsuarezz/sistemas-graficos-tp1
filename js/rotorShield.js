class RotorShield extends Objeto3D{
    constructor(){
        super();
        let shieldForm = new Forma();
        shieldForm.load2DSvgString("M -0.8 2 L -0.8 -2 C -0.4 -2.5 0.4 -2.5 0.8 -2 L 0.8 2 C 0.4 2.5 -0.4 2.5 -0.8 2", [0,0,1]);
        let shieldPath = new Forma();
        shieldPath.load2DSvgString("M -8 0 C -8 -4 -4 -8 0 -8 C 4 -8 8 -4 8 0 C 8 4 4 8 0 8 C -4 8 -8 4 -8 0", [0,1,0]);
        let shieldSurface = new SweptSurface(shieldForm, shieldPath, 100, 30, true);
        this.setGeometry(shieldSurface.positionBuffer, shieldSurface.indexBuffer, shieldSurface.normalBuffer);
    }
}