class CameraController_{
    constructor(){
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

        // orbital, rear, lateral, upper
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
            }
        })

        window.addEventListener('mouseup', e => {
            this.mouseDown = false;
        })
    }

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
}

