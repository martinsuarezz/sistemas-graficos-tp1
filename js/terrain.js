class Terrain{
    constructor(size, latitudeBands, longitudeBands){
    
        this.latitudeBands = latitudeBands;
        this.longitudeBands = longitudeBands;
        this.size = size;
        
        this.position_buffer = null;
        this.normal_buffer = null;
        this.texture_coord_buffer = null;
        this.index_buffer = null;

        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_texture_coord_buffer = null;
        this.webgl_index_buffer = null;
        
        this.texture = null;
    }

    initTexture(textureFile){
        this.texture = gl.createTexture();
        this.texture.image = new Image();

        this.texture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, terrain.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, terrain.texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.texture.image.src = textureFile;
    }
        
    initBuffers(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.texture_coord_buffer = [];

        var latNumber;
        var longNumber;

        for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
            for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
                var x = (-0.5+(latNumber/this.latitudeBands)) * this.size;
                var z = (-0.5+(longNumber/this.longitudeBands)) * this.size;
                var y = 0;

                var u = (longNumber / this.longitudeBands);
                var v = 1 - (latNumber / this.latitudeBands);

                this.normal_buffer.push(0);
                this.normal_buffer.push(1);
                this.normal_buffer.push(0);

                this.texture_coord_buffer.push(u);
                this.texture_coord_buffer.push(v);
                
                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);
            }
        }

        // Buffer de indices de los triangulos
        this.index_buffer = [];
        
        for (latNumber=0; latNumber < this.latitudeBands; latNumber++) {
            for (longNumber=0; longNumber < this.longitudeBands; longNumber++) {

                var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                var second = first + this.longitudeBands + 1;

                this.index_buffer.push(first);
                this.index_buffer.push(second);
                this.index_buffer.push(first + 1);

                this.index_buffer.push(second);
                this.index_buffer.push(second + 1);
                this.index_buffer.push(first + 1);
            }
        }

        // Creación e Inicialización de los buffers a nivel de OpenGL
        gl.useProgram(glProgram2);
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;
        gl.useProgram(glProgram);

        
    }

    draw(){
        gl.useProgram(glProgram2);

        var samplerUniform = gl.getUniformLocation(glProgram2, "uSampler");

        var vertexPositionAttribute = gl.getAttribLocation(glProgram2, "aPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        var textureCoordAttribute = gl.getAttribLocation(glProgram2, "aUv");
        gl.enableVertexAttribArray(textureCoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        /* NO USO LAS NORMALES, OPTIMIZACION
        var vertexNormalAttribute = gl.getAttribLocation(glProgram2, "aNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
        */
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(samplerUniform, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        
        //gl.uniform1i(glProgram.useLightingUniform,(lighting=="true"));                    
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        gl.useProgram(glProgram);
        /*
        if (modo!="smooth") {
            gl.uniform1i(shaderProgram.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        */
    }

}
