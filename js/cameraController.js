class CameraController{
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

        // orbital, rear, lateral, upper, front
        this.cameraSetting = "orbital";

        this.setupCameras();

        var scene = document.getElementById('my-canvas');

        scene.addEventListener('mousedown', e => {
            if (this.cameraSetting == "orbital"){
                this.xMouse = e.offsetX;
                this.yMouse = e.offsetY;
                this.mouseDown = true;
            }
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
            if (this.cameraSetting == "orbital"){
                this.radio += e.deltaY * this.velocidadScroll;
                if (this.radio < this.radioMin)
                    this.radio = this.radioMin;
                if (this.radio > this.radioMax)
                    this.radio = this.radioMax;
            }
        })

        scene.addEventListener('keydown', e => {
            switch(e.key){
                case "1":
                    this.cameraSetting = "orbital";
                    break;
                case "2":
                    this.cameraSetting = "rear";
                    this.mouseDown = false;
                    break;
                case "3":
                    this.cameraSetting = "lateral";
                    this.mouseDown = false;
                    break;
                case "4":
                    this.cameraSetting = "upper";
                    this.mouseDown = false;
                    break;
                case "5":
                    this.cameraSetting = "front";
                    this.mouseDown = false;
                    break;
            }
        })

        window.addEventListener('mouseup', e => {
            this.mouseDown = false;
        })
    }

    setupCameras(){
        this.rearCamera = new Camera(false);
        this.rearCamera.setPosition(-35, 35, 0);

        this.rearCameraN = new Camera(false);
        this.rearCameraN.setPosition(-35, 36, 0);

        this.lateralCamera = new Camera(false);
        this.lateralCamera.setPosition(0, 0, 35);

        this.lateralCameraN = new Camera(false);
        this.lateralCameraN.setPosition(0, 3, 35);

        this.upperCamera = new Camera(false);
        this.upperCamera.setPosition(0, 50, 0);

        this.upperCameraN = new Camera(false);
        this.upperCameraN.setPosition(1, 50, 0);

        this.frontCamera = new Camera(false);
        this.frontCamera.setPosition(13, 0, 0);

        this.frontCameraN = new Camera(false);
        this.frontCameraN.setPosition(13, 3, 0);

        this.frontCameraT = new Camera(false);
        this.frontCameraT.setPosition(18, 0, 0);
        
        this.target.addChild(this.rearCamera);
        this.target.addChild(this.rearCameraN);

        this.target.addChild(this.lateralCamera);
        this.target.addChild(this.lateralCameraN);

        this.target.addChild(this.upperCamera);
        this.target.addChild(this.upperCameraN);

        this.target.addChild(this.frontCamera);
        this.target.addChild(this.frontCameraN);
        this.target.addChild(this.frontCameraT);
    }
    
    getCameraPosition(){
        let modelMatrix;
        let pos = [0, 0, 0, 1];
        switch(this.cameraSetting){
            case "orbital":
                modelMatrix = this.target.getModelMatrix();
                let pos = [0, 0, 0, 1];
                vec4.transformMat4(pos, pos, modelMatrix);
                let x = this.radio * Math.sin(this.phi) * Math.sin(this.theta);
                let y = this.radio * Math.cos(this.phi);
                let z = this.radio * Math.sin(this.phi) * Math.cos(this.theta);
                vec4.add(pos, pos, [x, y, z, 0]);
                return pos;
            case "rear":
                modelMatrix = this.rearCamera.getModelMatrix();
                break;
            case "lateral":
                modelMatrix = this.lateralCamera.getModelMatrix();
                break;
            case "upper":
                modelMatrix = this.upperCamera.getModelMatrix();
                break;
            case "front":
                modelMatrix = this.frontCamera.getModelMatrix();
                break
        }
        vec4.transformMat4(pos, pos, modelMatrix);
        return pos;
    }
    
    getTargetPosition(){
        if (this.cameraSetting == "front"){
            let modelMatrix = this.frontCameraT.getModelMatrix();
            let pos = [0, 0, 0, 1];
            vec4.transformMat4(pos, pos, modelMatrix);
            return pos
        }
        let modelMatrix = this.target.getModelMatrix();
        let pos = [0, 0, 0, 1];
        vec4.transformMat4(pos, pos, modelMatrix);
        return pos;
    }

    getCameraNormal(){
        let modelMatrix1, modelMatrix2;
        let pos1 = [0, 0, 0, 1];
        let pos2 = [0, 0, 0, 1];
        switch(this.cameraSetting){
            case "orbital":
                return [0, 1, 0];
            case "rear":
                modelMatrix1 = this.rearCamera.getModelMatrix();
                modelMatrix2 = this.rearCameraN.getModelMatrix();
                break;
            case "lateral":
                modelMatrix1 = this.lateralCamera.getModelMatrix();
                modelMatrix2 = this.lateralCameraN.getModelMatrix();
                break;
            case "upper":
                modelMatrix1 = this.upperCamera.getModelMatrix();
                modelMatrix2 = this.upperCameraN.getModelMatrix();
                break;
            case "front":
                modelMatrix1 = this.frontCamera.getModelMatrix();
                modelMatrix2 = this.frontCameraN.getModelMatrix();
                break
        }
        let n = vec4.create();
        vec4.transformMat4(pos1, pos1, modelMatrix1);
        vec4.transformMat4(pos2, pos2, modelMatrix2);
        vec4.scaleAndAdd(n, pos2, pos1, -1);
        n = vec3.fromValues(...n);
        vec3.normalize(n, n);
        return n;
    }
}
