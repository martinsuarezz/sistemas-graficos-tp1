class ObjetosFactory{
    constructor(){
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null;
        this.matrizModelado = mat4.create();
        this.posicion = vec3.create();
        this.rotacion = vec3.create();
        this.anguloRotacion = 0;
        this.escala = vec3.fromValues(1,1,1);
        this.hijos = [];
        this.numero = 3;
    }
    
    obtenerCabina(){
        var cabina = new Objeto3D();
        var formaCabina = new Forma();
        formaCabina.load2DSvgString("M -6 2 C 3 3 6 0 6 -2 C 6 -3 -5 -2 -6 2", [0,0,1]);
        var recorridoCabina = new Forma();
        recorridoCabina.load2DSvgString("M 0 4 C 0 2 0 -2 0 -4", [0,1,0]);
        var puntosCabina = formaCabina.obtenerPuntos(10);
        var superficieCabina = new SweptSurface(formaCabina, recorridoCabina, 100, 7, true, [0.8,1,1.1,1.15,1.1,1,0.8], [0,0.05,0.3,0.5,0.7,0.95,1]);
        cabina.setGeometria(superficieCabina.positionBuffer, superficieCabina.indexBuffer, superficieCabina.normalBuffer);
        return cabina;
    }
    /*
    obtenerCabina(){
        var cabina = new Objeto3D();
        var formaCabina1 = new Forma();
        var formaCabina2 = new Forma();
        var formaCabina3 = new Forma();
        var formaCabina4 = new Forma();
        formaCabina1.load2DSvgString("M -0.56 0.24 C 0.32 0.32 0.56 0 0.56 -0.24 C -0.08 -0.24 -0.48 -0.08 -0.56 0.24", [0,0,1]);
        formaCabina2.load2DSvgString("M -5 2.2 C 2.9 2.9 5 0 5 -2.2 C -0.7 -2.2 -4.3 -0.7 -5 2.2", [0,0,1]);
        formaCabina3.load2DSvgString("M -6 2.64 C 3.48 3.48 6 0 6 -2.64 C -0.84 -2.64 -5.16 -0.84 -6 2.64", [0,0,1]);
        formaCabina4.load2DSvgString("M -7.2 3.2 C 4.2 4.2 7.2 0 7.2 -3.2 C -1 -3.2 -6.2 -1 -7.2 3.2", [0,0,1]);

        var formas = [formaCabina1.obtenerPuntos(30), formaCabina2.obtenerPuntos(30),
                    formaCabina3.obtenerPuntos(30), formaCabina4.obtenerPuntos(30),
                    formaCabina3.obtenerPuntos(30), formaCabina2.obtenerPuntos(30),
                    formaCabina1.obtenerPuntos(30)];
        
        var recorridoCabina = new Forma();
        recorridoCabina.load2DSvgString("M 0 4 C 0 2 0 -2 0 -4", [0,1,0]);
        var superficieCabina = new SuperficieBarridoMixta(formas, recorridoCabina.obtenerMatricesNivel(formas.length));
        cabina.setGeometria(superficieCabina.positionBuffer, superficieCabina.indexBuffer, superficieCabina.normalBuffer);
        return cabina;
    }
    */
}

//export{Objeto3D};