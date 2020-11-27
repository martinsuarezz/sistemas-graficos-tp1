class CameraController2{
    constructor(targetObject){
        this.mouseDown = false;
        this.xMouse = 0;
        this.yMouse = 0;

        this.theta = 0;
        this.phi = Math.PI/2;
        this.minPhi = 0.01;
        this.radio = 5;
        this.radioMin = 2;
        this.radioMax = 20;

        this.velocidadCamara = 0.01;
        this.velocidadScroll = 0.005;

        this.xRearDistance = -7;
        this.yRearDistance = 10;
        this.yUpperDistance = 5;
        this.zLateralDistance = 8;

        this.target = targetObject;

        this.rearCamera = new Camera(true);
        this.rearCamera.setPosition(-20, 20, 0);

        this.rearCamera2 = new Camera(true);
        this.rearCamera2.setPosition(-20, 23, 0);

        this.lateralCamera = new Camera(true);
        this.lateralCamera.setPosition(0, 0, 22);

        this.lateralCamera2 = new Camera(true);
        this.lateralCamera2.setPosition(0, 3, 22);

        this.frontCamera = new Camera(true);
        this.frontCamera.setPosition(11, 0, 0);

        this.frontCamera2 = new Camera(true);
        this.frontCamera2.setPosition(11, 3, 0);

        this.frontCamera3 = new Camera(true);
        this.frontCamera3.setPosition(14, 0, 0);
        
        this.target.addChild(this.rearCamera);
        this.target.addChild(this.rearCamera2);

        this.target.addChild(this.lateralCamera);
        this.target.addChild(this.lateralCamera2);

        this.target.addChild(this.frontCamera);
        this.target.addChild(this.frontCamera2);
        this.target.addChild(this.frontCamera3);

        // orbital, rear, lateral, upper, front
        this.cameraSetting = "orbital";

        var scene = document.getElementById('my-canvas');

        scene.addEventListener('mousedown', e => {
            this.xMouse = e.offsetX;
            this.yMouse = e.offsetY;
            this.mouseDown = true;
        });

        scene.addEventListener('mousemove', e => {
            if (this.mouseDown){
                this.theta -= (e.offsetX - this.xMouse) * this.velocidadCamara;
                this.phi -= (e.offsetY - this.yMouse) * this.velocidadCamara;
                this.xMouse = e.offsetX;
                this.yMouse = e.offsetY;

                if (this.phi <= 0)
                    this.phi = this.minPhi; // no anda si llega a 0
                if (this.phi > Math.PI)
                    this.phi = Math.PI;
            }
        })

        scene.addEventListener('wheel', e => {
            this.radio += e.deltaY * this.velocidadScroll;
            if (this.radio < this.radioMin)
                this.radio = this.radioMin;
            if (this.radio > this.radioMax)
                this.radio = this.radioMax;
        })

        scene.addEventListener('keydown', e => {
            switch(e.key){
                case "1":
                    this.cameraSetting = "orbital";
                    break;
                case "2":
                    this.cameraSetting = "rear";
                    break;
                case "3":
                    this.cameraSetting = "lateral";
                    break;
                case "4":
                    this.cameraSetting = "upper";
                    break;
                case "5":
                    this.cameraSetting = "front";
                    break;
            }
        })

        window.addEventListener('mouseup', e => {
            this.mouseDown = false;
        })
    }
    
    getPosition(){
        let modelMatrix = this.rearCamera.getModelMatrix();
        let pos = [0, 0, 0, 1];
        switch(this.cameraSetting){
            case "orbital":
                return this.getPosition_();
            case "rear":
                modelMatrix = this.rearCamera.getModelMatrix();
                break;
            case "lateral":
                modelMatrix = this.lateralCamera.getModelMatrix();
                break;
            case "upper":
                return this.getPosition_();
            case "front":
                modelMatrix = this.frontCamera.getModelMatrix();
                break
        }
        vec4.transformMat4(pos, pos, modelMatrix);
        return pos;
    }
    
    getPosition_(){
        let modelMatrix = this.target.getModelMatrix();
        let pos = [0, 0, 0, 1];
        vec4.transformMat4(pos, pos, modelMatrix);
        let x = 0;
        let y = 0;
        let z = 0;
        switch(this.cameraSetting){
            case "orbital":
                x = this.radio * Math.sin(this.phi) * Math.sin(this.theta);
                y = this.radio * Math.cos(this.phi);
                z = this.radio * Math.sin(this.phi) * Math.cos(this.theta);
                break;
            case "rear":
                x = this.xRearDistance;
                y = this.yRearDistance;
                break;
            case "lateral":
                z = this.zLateralDistance;
                break;
            case "upper":
                y = this.yRearDistance;
                z = 0.01;
                break;
        }
        vec4.add(pos, pos, [x, y, z, 0]);
        return pos;
    }
    
    getTarget(){
        if (this.cameraSetting == "front"){
            let modelMatrix = this.frontCamera3.getModelMatrix();
            let pos = [0, 0, 0, 1];
            vec4.transformMat4(pos, pos, modelMatrix);
            return pos
        }
        let modelMatrix = this.target.getModelMatrix();
        let pos = [0, 0, 0, 1];
        vec4.transformMat4(pos, pos, modelMatrix);
        return pos;
    }

    getNormal(){
        let modelMatrix1 = this.rearCamera.getModelMatrix();
        let modelMatrix2 = this.rearCamera2.getModelMatrix();
        let pos1 = [0, 0, 0, 1];
        let pos2 = [0, 0, 0, 1];
        let n = vec4.create();
        vec4.transformMat4(pos1, pos1, modelMatrix1);
        vec4.transformMat4(pos2, pos2, modelMatrix2);
        vec4.scaleAndAdd(n, pos2, pos1, -1);
        n = vec3.fromValues(n[0], n[1], n[2]);
        vec3.normalize(n, n);
        return n;
    }
    /*

    getPosition(helicopterPosition){
        let xHeli = helicopterPosition[0];
        let yHeli = helicopterPosition[1];
        let zHeli = helicopterPosition[2];
        let x, y, z;
        switch(this.cameraSetting){
            case "orbital":
                x = this.radio * Math.sin(this.phi) * Math.sin(this.theta);
                y = this.radio * Math.cos(this.phi);
                z = this.radio * Math.sin(this.phi) * Math.cos(this.theta);
                break;
            case "rear":
                x = xHeli + this.xRearDistance;
                y = yHeli + this.yRearDistance;
                z = zHeli;
                break;
            case "lateral":
                x = xHeli;
                y = yHeli;
                z = zHeli + this.zLateralDistance;
                break;
            case "upper":
                x = xHeli;
                y = yHeli + this.yRearDistance;
                z = zHeli + 0.01;
                break;
        }
        return [x, y, z];
    }
    */
}
