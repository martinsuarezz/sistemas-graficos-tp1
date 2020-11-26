class Axis extends Objeto3D{
    constructor(){
        super();
        let formaCabina = new Forma();
        formaCabina.load2DSvgString("M -3 0 C -3 -4 3 -4 3 0 C 3 4 -3 4 -3 0", [0,0,1]);
        let recorridoCabina = new Forma();
        recorridoCabina.load2DSvgString("M 0 4 C 0 2 0 -2 0 -4", [0,1,0]);
        let superficieCabina = new SweptSurface(formaCabina, recorridoCabina, 100, 7, true);
        this.setGeometria(superficieCabina.positionBuffer, superficieCabina.indexBuffer, superficieCabina.normalBuffer);
    }
}