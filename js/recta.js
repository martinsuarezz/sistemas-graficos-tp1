class Recta{
    constructor(p0, p1, nAxis){
        this.p0 = p0;
        this.p1 = p1;
        this.nAxis = nAxis;
    }

    getPoint(u){
        var x = vec3.create();
        vec3.scaleAndAdd(x, x, this.p1, u);
        vec3.scaleAndAdd(x, x, this.p0, (1 - u)); // X = p0 * t + p1 (1 - t)
        return x;
    }

    getTangent(u){
        var t = vec3.create();
        vec3.scaleAndAdd(t, this.p1, this.p0, -1); // T = p1 - p0
        vec3.normalize(t, t);
        return t;
    }

    getNormal(u){
        var n = vec3.create();
        var t = this.getTangent(u);
        /*
        if (t.indexOf(1) != -1 || t.indexOf(-1) != -1){ //versor
            var index = Math.max(t.indexOf(1), t.indexOf(-1))
            n = [0, 0, 0];
            n.splice((t[index] + 1) % 3, 1, 1);
        }
        else{
            n = [-t[1], -t[0], 0];
        }
        */
        vec3.cross(n, t, this.nAxis);
        vec3.normalize(n, n);
        return n;
    }

    getPoints(n){
        return [this.p0, this.p1];
    }

    getTangents(n){
        let t = this.getTangent();
        return [t, t];
    }

    getNormals(n){
        let norm = this.getNormal();
        return [norm, norm];
    }

    obtenerPuntos(n){
        n -= 1;
        var puntos = [];
        for (var i = 0; i <= n; i++){  
            var x = this.obtenerPunto(i/n);
            puntos.push(x);
        }
        return puntos;
    }

    obtenerMatrices(n){
        n -= 1;
        var matrices = [];
        for (var i = 0; i <= n; i++){ 
            var u = i / n;
            var tang = this.getTangent(u);
            var norm = this.getNormal(u);
            var pos = this.getPoint(u);
            var binorm = vec3.create();
            vec3.cross(binorm, norm, tang);
            var m = mat4.fromValues(norm[0], norm[1], norm[2], 0,
                                    binorm[0], binorm[1], binorm[2], 0,
                                    tang[0], tang[1], tang[2], 0,
                                    pos[0], pos[1], pos[2], 1);
            matrices.push(m);
        }
        return matrices;
    }
}
