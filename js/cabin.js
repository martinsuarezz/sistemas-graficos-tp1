class Cabin extends Objeto3D{
    constructor(){
        super();
        let formaCabina = new Forma();
        formaCabina.load2DSvgString("M -6 2 C 3 3 6 0 6 -2 C 6 -3 -5 -2 -6 2", [0,0,1]);
        let recorridoCabina = new Forma();
        recorridoCabina.load2DSvgString("M 0 4 C 0 2 0 -2 0 -4", [0,1,0]);
        let superficieCabina = new SweptSurface(formaCabina, recorridoCabina, 100, 7, true, [0.8,1,1.1,1.15,1.1,1,0.8], [0,0.05,0.3,0.5,0.7,0.95,1]);
        this.setGeometry(superficieCabina.positionBuffer, superficieCabina.indexBuffer, superficieCabina.normalBuffer);
    }
}