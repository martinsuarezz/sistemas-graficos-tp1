class SkidLowerPart extends Objeto3D{
    constructor(){
        super();
        let skidLowerForm = new Forma();
        skidLowerForm.load2DSvgString("M -0.4 0 C -0.4 -0.2 -0.2 -0.4 0 -0.4 C 0.2 -0.4 0.4 -0.2 0.4 0 C 0.4 0.2 0.2 0.4 0 0.4 C -0.2 0.4 -0.4 0.2 -0.4 0", [0,0,1]);
        let skidLowerPath = new Forma();
        skidLowerPath.load2DSvgString("M 2 -9 C 0 -9 0 -8 0 -7 L 0 7 C 0 8 0 9 2 9", [0,1,0]);
        let skidSurface = new SweptSurface(skidLowerForm, skidLowerPath, 100, 30, true);
        this.setGeometry(skidSurface.positionBuffer, skidSurface.indexBuffer, skidSurface.normalBuffer);
    }
}
