class Objeto3D{
    constructor(){
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null;

        this.webGL_vertexBuffer = null;
        this.webGL_indexBuffer = null;
        this.webGL_normalBuffer = null;
        this.webGL_vertexAttribute = null;

        this.matrizModelado = mat4.create();

        this.posicion = vec3.create();
        this.rotations = [[0, [1, 0, 0]],
                          [0, [0, 1, 0]],
                          [0, [0, 0, 1]]];
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.escala = vec3.fromValues(1,1,1);

        this.hijos = [];
        this.color = [1, 1, 1];
    }

    initializeBuffers(){
        this.webGL_vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexBuffer), gl.STATIC_DRAW);
        this.webGL_vertexBuffer.itemSize = 3;
        this.webGL_vertexBuffer.numItems = this.vertexBuffer.length / 3;

        this.webGL_indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webGL_indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        this.webGL_indexBuffer.itemSize = 1;
        this.webGL_indexBuffer.number_vertex_point = this.indexBuffer.length;

        if (this.normalBuffer){
            this.webGL_normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        }
    }

    actualizarMatrizModelado(matrizPadre){
        this.matrizModelado = mat4.create();
    
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        for (let i = 0; i < this.rotations.length; i++){
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotations[i][0], this.rotations[i][1]);
        }
        /*
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotationX, [1, 0, 0]);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotationY, [0, 1, 0]);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotationZ, [0, 0, 1]);
        */
        mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
        if (matrizPadre)
            mat4.multiply(this.matrizModelado, matrizPadre, this.matrizModelado);
    }

    draw(matrizPadre){
        this.actualizarMatrizModelado();
        var matriz = mat4.create();
        if (!matrizPadre)
            var matrizPadre = mat4.create();
        mat4.multiply(this.matrizModelado, matrizPadre, this.matrizModelado);

        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, this.matrizModelado);

        var objColor = gl.getUniformLocation(glProgram, "objColor");
        gl.uniform3fv(objColor, this.color);

        if (this.vertexBuffer && this.indexBuffer){
            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_vertexBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.webGL_vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webGL_normalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webGL_indexBuffer);
            gl.drawElements( gl.TRIANGLE_STRIP, this.webGL_indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }
        
        for (var i = 0; i < this.hijos.length; i++)
            this.hijos[i].draw(this.matrizModelado);
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

    setFirstRotation(angle, axis){
        this.rotations[0] = [angle, axis];
    }

    setSecondRotation(angle, axis){
        this.rotations[1] = [angle, axis];
    }

    setThirdRotation(angle, axis){
        this.rotations[2] = [angle, axis];
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

    setColor(newColor){
        this.color = newColor;
    }

    getModelMatrix(){
        return this.matrizModelado;
    }

    getPosition(){
        let pos = [0, 0, 0, 1];
        vec4.transformMat4(pos, pos, this.getModelMatrix());
        return pos;
    }
}
