class SuperficieBarridoMixta{
    constructor(formas, recorridoM, escala){
        this.indexBuffer = [];
        this.positionBuffer = [];
        this.normalBuffer = [];
        this.uvBuffer = [];
        this.formas = formas;
        this.recorridoM = recorridoM;
        this.escala = escala;
        this.generarSuperficie();
    }

    obtenerPosicion(i, j){
        var pos = vec4.create();
        vec4.copy(pos, this.formas[i][j]);
        if (this.escala)
            vec4.scale(pos, pos, this.escala[i]);
        pos[3] = 1;
        vec4.transformMat4(pos, pos, this.recorridoM[i]);
        return pos;
    }

    obtenerNormal(i, j){
        var norm = vec3.create();
        var tang1 = vec3.create();
        var tang2 = vec3.create();
        var pos1, pos2;

        if (i == this.recorridoM.length - 1){
            pos1 = this.obtenerPosicion(i - 1, j);
            pos2 = this.obtenerPosicion(i, j);
        }
        else{
            pos2 = this.obtenerPosicion(i + 1, j);
            pos1 = this.obtenerPosicion(i, j);
        }
        vec3.scaleAndAdd(tang1, pos2, pos1, -1);

        if (j == this.formas[0].length - 1){
            pos1 = this.obtenerPosicion(i, j - 1);
            pos2 = this.obtenerPosicion(i, j);
        }
        else{
            pos2 = this.obtenerPosicion(i, j + 1);
            pos1 = this.obtenerPosicion(i, j);
        }
        vec3.scaleAndAdd(tang2, pos2, pos1, -1);
        vec3.cross(norm, tang1, tang2);
        return norm;
    }

    generarSuperficie(){
        var niveles = this.recorridoM.length;
        var puntos = this.formas[0].length;

        for (var i=0; i < niveles; i++){
            for (var j=0; j < puntos; j++){
                var pos = this.obtenerPosicion(i, j);
                
                this.positionBuffer.push(pos[0]);
                this.positionBuffer.push(pos[1]);
                this.positionBuffer.push(pos[2]);

                var nrm = this.obtenerNormal(i, j);

                this.normalBuffer.push(nrm[0]);
                this.normalBuffer.push(nrm[1]);
                this.normalBuffer.push(nrm[2]);

                var uvs=[i/niveles, j/puntos];

                this.uvBuffer.push(uvs[0]);
                this.uvBuffer.push(uvs[1]);
            }
    }

    function getIndex(n,p){return n * puntos + p;}

    for (var n=0; n < (this.positionBuffer.length / (puntos * 3)) - 1; n++) {
        for (var p=0; p < puntos; p++) {
            this.indexBuffer.push(getIndex(n, p));
            this.indexBuffer.push(getIndex(n+1, p));            
        }
        this.indexBuffer.push(getIndex(n + 1, puntos - 1));
        this.indexBuffer.push(getIndex(n + 1, 0));
    }
    }
}
