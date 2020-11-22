/*
    La clase SweptSurface se encarga de generar las
    superficies de barrido.
*/
class SweptSurface{
    /*
        @param {Form} form Una forma para usar en la superficie de barrido.
        @param {BezierCurve} path Una curva que seguirá la superficie de barrido.
        @param {int} points La cantidad de puntos por los que discretizar la forma.
        @param {int} levels La cantidad de puntos por los que discretizar el path.
        @param {boolean} lid Determina si incluir tapas a la superficie.
        @param {Array<float>} scale Cada numero del array determina un escalado
        para cada nivel del path.
        @param {Array<float>} levelsDelta El array debe contener numeros del 0 a 1.
        Indican que sección de la curva tomar para cada nivel.
    */
    constructor(form, path, points, levels, lid = true, scale, levelsDelta){
        this.indexBuffer = [];
        this.positionBuffer = [];
        this.normalBuffer = [];
        this.uvBuffer = [];
        this.form = form;
        this.points = points;
        this.path = path;
        this.matrixPath = [];
        this.levels = levels;
        this.lid = lid;
        this.scale = scale;
        this.levelsDelta = levelsDelta;
        this.calculateLevelMatrix();
        this.generateSurface();
    }

    calculateLevelMatrix(){
        var levelsD = this.levelsDelta;

        if (!levelsD){
            levelsD = [];
            for (let u = 0; u <= 1; u += 1/(this.levels - 1)){
                levelsD.push(u);
            }
        }

        for (let i = 0; i < levelsD.length; i++){ 
            let u = levelsD[i];
            let tang = this.path.getTangent(u);
            let norm = this.path.getNormal(u);
            let pos = this.path.getPoint(u);
            var binorm = vec3.create();
            vec3.cross(binorm, norm, tang);
            var m = mat4.fromValues(norm[0],    norm[1],    norm[2],    0,
                                    binorm[0],  binorm[1],  binorm[2],  0,
                                    tang[0],    tang[1],    tang[2],    0,
                                    pos[0],     pos[1],     pos[2],     1);
            this.matrixPath.push(m);
        }
    }

    generateSurface(){
        if (this.lid) {
            for (let i=0; i <= this.points; i++){
                let u = i/this.points;
                let pos = this.form.getPoint(u);
                vec4.scale(pos, pos, 0);
                pos = vec4.fromValues(...pos, 1);
                vec4.transformMat4(pos, pos, this.matrixPath[0]);

                this.positionBuffer.push(pos[0]);
                this.positionBuffer.push(pos[1]);
                this.positionBuffer.push(pos[2]);

                var nrm = this.path.getTangent(0);
                vec3.scale(nrm, nrm, -1);

                this.normalBuffer.push(nrm[0]);
                this.normalBuffer.push(nrm[1]);
                this.normalBuffer.push(nrm[2]);

                var uvs=[0, u];

                this.uvBuffer.push(uvs[0]);
                this.uvBuffer.push(uvs[1]);
            }
        }

        for (var i=0; i < this.levels; i++){
            let t = i/this.levels;
            for (var j=0; j <= this.points; j++){
                let u = j/this.points;
                let pos = this.form.getPoint(u);
                if (this.scale){
                    vec3.scale(pos, pos, this.scale[i]);
                }
                pos = vec4.fromValues(...pos, 1);
                vec4.transformMat4(pos, pos, this.matrixPath[i]);
                
                this.positionBuffer.push(pos[0]);
                this.positionBuffer.push(pos[1]);
                this.positionBuffer.push(pos[2]);

                var nrm = vec3.create();
                var tang1 = this.form.getTangent(u);
                var tang2 = this.path.getTangent(t);
                vec3.cross(nrm, tang1, tang2);

                this.normalBuffer.push(nrm[0]);
                this.normalBuffer.push(nrm[1]);
                this.normalBuffer.push(nrm[2]);

                var uvs=[t, u];

                this.uvBuffer.push(uvs[0]);
                this.uvBuffer.push(uvs[1]);
            }
    }

        if (this.lid) {
            for (let i=0; i <= this.points; i++){
                let u = i / this.points;
                let pos = this.form.getPoint(u);
                vec4.scale(pos, pos, 0);
                pos = vec4.fromValues(...pos, 1);
                vec4.transformMat4(pos, pos, this.matrixPath[this.matrixPath.length - 1]);

                this.positionBuffer.push(pos[0]);
                this.positionBuffer.push(pos[1]);
                this.positionBuffer.push(pos[2]);

                var nrm = this.path.getTangent(1);

                this.normalBuffer.push(nrm[0]);
                this.normalBuffer.push(nrm[1]);
                this.normalBuffer.push(nrm[2]);

                var uvs=[0, u];

                this.uvBuffer.push(uvs[0]);
                this.uvBuffer.push(uvs[1]);
            }
        }

        let points = this.points + 1;
        function getIndex(n, p){return n * points + p;}

        for (var n = 0; n < (this.positionBuffer.length / (points * 3)) - 1; n++) {
            for (var p = 0; p <= points; p++) {
                this.indexBuffer.push(getIndex(n, p));
                this.indexBuffer.push(getIndex(n+1, p));            
            }
            this.indexBuffer.push(getIndex(n + 1, points - 1, points));
            this.indexBuffer.push(getIndex(n + 1, 0, points));
        }
        console.log(this.indexBuffer);
        //this.indexBuffer = [0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 11, 6, 6, 12, 7, 13, 8, 14, 9, 15, 10, 16, 11, 17, 12, 18, 17, 12];
    }
}
