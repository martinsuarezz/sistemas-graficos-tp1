class CurvaBezier{
    constructor(p0, p1, p2, p3, nAxis){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.nAxis = nAxis;

        this.a = vec3.create();
        vec3.scaleAndAdd(this.a, this.a, p0, -1);
        vec3.scaleAndAdd(this.a, this.a, p1, 3);
        vec3.scaleAndAdd(this.a, this.a, p2, -3);
        vec3.scaleAndAdd(this.a, this.a, p3, 1);

        this.b = vec3.create();
        vec3.scaleAndAdd(this.b, this.b, p0, 3);
        vec3.scaleAndAdd(this.b, this.b, p1, -6);
        vec3.scaleAndAdd(this.b, this.b, p2, 3);

        this.c = vec3.create();
        vec3.scaleAndAdd(this.c, this.c, p0, -3);
        vec3.scaleAndAdd(this.c, this.c, p1, 3);

        this.d = vec3.create();
        vec3.scaleAndAdd(this.d, this.d, p0, 1);
    }

    getPoint(u){
        var x = vec3.create();
        vec3.scaleAndAdd(x, x, this.a, u ** 3);
        vec3.scaleAndAdd(x, x, this.b, u ** 2);
        vec3.scaleAndAdd(x, x, this.c, u);
        vec3.scaleAndAdd(x, x, this.d, 1);
        return x;
    }

    getTangent(u){
        var t = vec3.create();
        vec3.scaleAndAdd(t, t, this.a, 3 * u ** 2);
        vec3.scaleAndAdd(t, t, this.b, 2 * u);
        vec3.scaleAndAdd(t, t, this.c, 1);
        vec3.normalize(t, t);
        return t;
    }

    getNormal(u){
        /*
        //Por segunda derivada
        var n = vec3.create();
        vec3.scaleAndAdd(n, n, this.a, 6 * u);
        vec3.scaleAndAdd(n, n, this.b, 2);
        vec3.normalize(n, n);
        //return [1,0,0];
        */
        var n = vec3.create();
        vec3.cross(n, this.getTangent(u), this.nAxis);
        return n;
        
    }

    getPoints(n){
        n -= 1;
        let points = [];
        for (var i = 0; i <= n; i++){  
            points.push(this.getPoint(i/n));
        }
        return points;
    }

    getTangents(n){
        n -= 1;
        let tangents = [];
        for (var i = 0; i <= n; i++){  
            tangents.push(this.getTangent(i/n));
        }
        return tangents;
    }

    getNormals(n){
        n -= 1;
        let normals = [];
        for (var i = 0; i <= n; i++){  
            normals.push(this.getNormal(i/n));
        }
        return normals;
    }

    obtenerPuntos(n){
        n -= 1;
        var puntos = [];
        for (var i = 0; i <= n; i++){  
            var x = this.getPoint(i/n);
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
