class Objeto3D{
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

    actualizarMatrizModelado(){
        this.matrizModelado = mat4.create();
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.anguloRotacion ,this.rotacion);
        mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }

    dibujar(matrizPadre){
        this.actualizarMatrizModelado();
        var matriz = mat4.create();
        if(!matrizPadre)
            var matrizPadre = mat4.create();
        mat4.multiply(matriz, matrizPadre, this.matrizModelado);

        if (this.vertexBuffer && this.indexBuffer){
            trianglesVerticeBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexBuffer), gl.STATIC_DRAW);

            trianglesIndexBuffer = gl.createBuffer();
            trianglesIndexBuffer.number_vertex_point = this.indexBuffer.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);

            if (this.normalBuffer){
                trianglesNormalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
            }

            vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
            gl.drawElements( gl.TRIANGLE_STRIP, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);

            var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
            gl.uniformMatrix4fv(modelMatrixUniform, false, matriz);
        }
        
        for (var i = 0; i < this.hijos.length; i++)
            this.hijos[i].dibujar(matriz);
    }

    setGeometria(vertexBuffer, indexBuffer, normalBuffer){
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.normalBuffer = normalBuffer;
    }

    agregarHijo(objetoHijo){
        this.hijos.push(objetoHijo);
    }

    quitarHijo(index){
        if (index < this.hijos.length)
            this.hijos.splice(index, 1);
    }

    setPosicion(x,y,z){
        this.posicion = vec3.fromValues(x,y,z);
    }

    setRotacion(angulo,x,y,z){
        this.anguloRotacion = angulo;
        this.rotacion = vec3.fromValues(x,y,z);
    }

    setEscala(x,y,z){
        if (y == undefined)
            this.escala = vec3.fromValues(x,x,x);
        else
            this.escala = vec3.fromValues(x,y,z);
    }
}
