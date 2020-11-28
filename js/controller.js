class Controller{
    constructor(){
        this.helicopterController = new HelicopterController();
        //this.cameraController = new CameraController();
    }

    getHelicopterPosition(){
        return [this.helicopterController.positionX,
                this.helicopterController.positionY,
                this.helicopterController.positionZ];
    }

    getHelicopterRotation(){
        return [this.helicopterController.roll,
                this.helicopterController.angle,
                this.helicopterController.pitch];
    }

    getHelicopterSpeed(){
        return this.helicopterController.speed;
    }

    getCameraPosition(){
        return this.cameraController.getPosition(this.getHelicopterPosition());
    }

    getCameraTarget(){
        return this.getHelicopterPosition();
    }

    tick(){
        this.helicopterController.tick();
    }
}