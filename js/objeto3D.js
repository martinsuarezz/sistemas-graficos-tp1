class Objeto3D{
    constructor(){
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null;

        this.webGL_vertexBuffer = null;
        this.webGL_indexBuffer = null;
        this.webGL_normalBuffer = null;
        this.webGL_vertexAttribute

        this.matrizModelado = mat4.create();

        this.posicion = vec3.create();
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.escala = vec3.fromValues(1,1,1);

        this.hijos = [];
    }

    initializeBuffers(){
        this.webGL_vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexBuffer), gl.STATIC_DRAW);

        this.webGL_indexBuffer = gl.createBuffer();
        this.webGL_indexBuffer.number_vertex_point = this.indexBuffer.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webGL_indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);

        if (this.normalBuffer){
            this.webGL_normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        }
    }

    actualizarMatrizModelado(){
        this.matrizModelado = mat4.create();
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotationX, [1, 0, 0]);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotationY, [0, 1, 0]);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotationZ, [0, 0, 1]);
        mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }

    draw(matrizPadre){
        this.actualizarMatrizModelado();
        var matriz = mat4.create();
        if (!matrizPadre)
            var matrizPadre = mat4.create();
        mat4.multiply(matriz, matrizPadre, this.matrizModelado);

        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, matriz);

        if (this.vertexBuffer && this.indexBuffer){
            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_vertexBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_normalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webGL_indexBuffer);
            gl.drawElements( gl.TRIANGLE_STRIP, this.webGL_indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }
        
        for (var i = 0; i < this.hijos.length; i++)
            this.hijos[i].draw(matriz);
    }

    setGeometry(vertexBuffer, indexBuffer, normalBuffer){
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.normalBuffer = normalBuffer;
        this.initializeBuffers();
    }

    addChild(objetoHijo){
        this.hijos.push(objetoHijo);
    }

    removeChild(index){
        if (index < this.hijos.length)
            this.hijos.splice(index, 1);
    }

    setPosition(x,y,z){
        this.posicion = vec3.fromValues(x,y,z);
    }

    setRotation(x, y, z){
        this.rotationX = x;
        this.rotationY = y;
        this.rotationZ = z;
    }

    setScale(x,y,z){
        if (y == undefined)
            this.escala = vec3.fromValues(x,x,x);
        else
            this.escala = vec3.fromValues(x,y,z);
    }
}
