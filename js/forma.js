class Forma{
    constructor(){
        this.curvas = [];
    }

    create2DPoint(e1, e2, nAxis){
        var point = [e1, e2];
        point.splice(nAxis.indexOf(1), 0, 0);
        return point;
    }

    load2DSvgString(svgString, nAxis = [0, 0, 1]){
        svgString = svgString.replace(',','');
        var commands = svgString.split(' ');
        var i = 0;
        if (commands[i] == 'M')
            i++;
        var p1;
        while(i < commands.length){
            if (commands[i] == 'C'){
                var p2 = this.create2DPoint(parseFloat(commands[i+1]), parseFloat(commands[i+2]), nAxis);
                var p3 = this.create2DPoint(parseFloat(commands[i+3]), parseFloat(commands[i+4]), nAxis);
                var p4 = this.create2DPoint(parseFloat(commands[i+5]), parseFloat(commands[i+6]), nAxis);
                if (this.colineares(p1,p2,p3,p4))
                    this.curvas.push(new Recta(p1, p4, nAxis));
                else
                    this.curvas.push(new CurvaBezier(p1, p2, p3, p4, nAxis));
                i += 1;
            }
            else if (commands[i] == 'L'){
                var p2 = this.create2DPoint(parseFloat(commands[i+1]), parseFloat(commands[i+2]), nAxis);
                this.curvas.push(new Recta(p1, p2, nAxis));
                i += 1;
            }
            else{
                p1 = this.create2DPoint(parseFloat(commands[i]), parseFloat(commands[i+1]), nAxis);
                i += 2;
            }
        }
    }

    load3DSvgString(svgString){
        svgString = svgString.replace(',','');
        var commands = svgString.split(' ');
        var i = 0;
        if (commands[i] == 'M')
            i++;
        var p1;
        while(i < commands.length){
            if (commands[i] == 'C'){
                var p2 = [parseFloat(commands[i+1]), parsparseFloateInt(commands[i+2]), parseFloat(commands[i+2])];
                var p3 = [parseFloat(commands[i+3]), parseFloat(commands[i+4]), parseFloat(commands[i+5])];
                var p4 = [parseFloat(commands[i+6]), parseFloat(commands[i+7]), parseFloat(commands[i+8])];
                if (this.colineares(p1,p2,p3,p4))
                    this.curvas.push(new Recta(p1, p4));
                else
                    this.curvas.push(new CurvaBezier(p1, p2, p3, p4));
                i += 1;
            }
            else if (commands[i] == 'L'){

            }
            else{
                p1 = [parseFloat(commands[i]), parseFloat(commands[i+1]), parseFloat(commands[i+2])];
                i += 3;
            }
        }
    }

    getPoint(u){
        u = u * this.curvas.length;
        if (u == this.curvas.length)
            return this.curvas[u - 1].getPoint(1);
        return this.curvas[Math.floor(u)].getPoint(u - Math.floor(u));
    }

    getTangent(u){
        u = u * this.curvas.length;
        if (u == this.curvas.length)
            return this.curvas[u - 1].getTangent(1);
        return this.curvas[Math.floor(u)].getTangent(u - Math.floor(u));
    }

    getNormal(u){
        u = u * this.curvas.length;
        if (u == this.curvas.length)
            return this.curvas[u - 1].getNormal(1);
        return this.curvas[Math.floor(u)].getNormal(u - Math.floor(u));
    }

    obtenerPuntos(n){
        var nPuntos = Math.round(n / this.curvas.length);
        var puntos = [];
        for (var i = 0; i < this.curvas.length; i++){
            puntos = puntos.concat(this.curvas[i].obtenerPuntos(nPuntos));
        }
        return puntos;
    }

    getPoints(n){
        let points = [];
        let pointsPerCurve = Math.round(n / this.curvas.length);
        for (var i = 0; i < this.curvas.length; i++){
            points = points.concat(this.curvas[i].getPoints(pointsPerCurve));
        }
        return points;
    }

    getTangents(n){
        let tangents = [];
        let tangentsPerCurve = Math.round(n / this.curvas.length);
        for (var i = 0; i < this.curvas.length; i++){
            tangents = tangents.concat(this.curvas[i].getTangents(tangentsPerCurve));
        }
        return tangents;
    }

    getNormals(n){
        let normals = [];
        let normalsPerCurve = Math.round(n / this.curvas.length);
        for (var i = 0; i < this.curvas.length; i++){
            normals = normals.concat(this.curvas[i].getNormals(normalsPerCurve));
        }
        return normals;
    }

    obtenerMatricesNivel(n){
        var nMatrices = Math.round(n / this.curvas.length);
        var matrices = [];
        for (var i = 0; i < this.curvas.length; i++){
            matrices = matrices.concat(this.curvas[i].obtenerMatrices(nMatrices));
        }
        return matrices;
    }

    colineares(p1,p2,p3,p4){
        var v1 = vec3.create();
        var v2 = vec3.create();
        var v3 = vec3.create();
        var nullVector = [0, 0, 0];

        vec3.scaleAndAdd(v1, p2, p1, -1);
        vec3.scaleAndAdd(v2, p3, p2, -1);
        vec3.scaleAndAdd(v3, p4, p3, -1);

        vec3.cross(v1, v1, v2);
        vec3.cross(v2, v2, v3);
        return vec3.exactEquals(nullVector, v1) && vec3.exactEquals(nullVector, v2);
    }

}
