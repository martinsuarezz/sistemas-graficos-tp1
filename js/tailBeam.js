class TailBeam extends Objeto3D{
    constructor(){
        super();
        let beamForm = new Forma();
        beamForm.load2DSvgString("M -11 4 L -11 0 L 12 -3 L 12 -2 L -11 4", [0,0,1]);
        let beamPath = new Forma();
        beamPath.load2DSvgString("M 0 0 L 0 2", [0,1,0]);
        let beamSurface = new SweptSurface(beamForm, beamPath, 4, 2, true);
        this.setGeometry(beamSurface.positionBuffer, beamSurface.indexBuffer, beamSurface.normalBuffer);
    }
}
