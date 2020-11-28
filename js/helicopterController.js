class HelicopterController{
    constructor(){
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;

        this.xArrow = 0;
        this.yArrow = 0;
        this.zArrow = 0;

        this.altitudeInertia=0.01;
        this.speedInertia=0.1;
        this.angleInertia=0.02;
    
        this.deltaAltitude=1;
        this.deltaSpeed=0.01;
        this.deltaAngle=0.03;
    
        this.maxSpeed=2;
        this.maxAltitude=300;
        this.minAltitude=1;
    
        this.speed = 0;
        this.altitude=this.minAltitude;
        this.angle=0;
    
        this.pitch=0;
        this.roll=0;
    
        this.angleTarget=0;
        this.altitudeTarget=this.minAltitude;
        this.speedTarget=0;

        this.topPitch = 0.3;

        var scene = document.getElementById('my-canvas');
        scene.addEventListener('keydown', e => {
            this.handleDownKey(e.key);
        });

        scene.addEventListener('keyup', e => {
            this.handleUpKey(e.key);
        });
    }

    getPosition(){
        return [this.positionX, this.positionY, this.positionZ];
    }

    getRotation(){
        return [this.roll, this.angle, this.pitch];
    }

    getSpeed(){
        return this.speedTarget;
    }

    handleDownKey(key){
        switch(key){
            case "w":
                this.xArrow=1;
                break;
            case "s":
                this.xArrow=-1;
                break;
            case "a":
                this.zArrow=1;
                break;                                
            case "d":
                this.zArrow=-1;
                break;
            case "e":
                this.yArrow=1;
                break;                
            case "q":
                this.yArrow=-1;
                break;
        }
    }

    handleUpKey(key){
        switch(key){
            case "w":
            case "s":
                this.xArrow=0;
                break;
            case "a":
            case "d":
                this.zArrow=0;
                break;
            case "e":
            case "q":
                this.yArrow=0;
                break;
        }
    }

    tick(){
        if (this.xArrow!=0) {
            this.speedTarget += this.xArrow * this.deltaSpeed;            
        } else {
            this.speedTarget += (0-this.speedTarget) * this.deltaSpeed;
        }
        
        this.speedTarget = Math.max(-this.maxAltitude, Math.min(this.maxSpeed,this.speedTarget));

        var speedSign=1;
        if (this.speed < 0) speedSign=-1

        if (this.zArrow!=0) {            
            this.angleTarget += this.zArrow * this.deltaAngle * speedSign;            
        }        

        if (this.yArrow!=0) {
            this.altitudeTarget += this.yArrow * this.deltaAltitude;
            this.altitudeTarget = Math.max(this.minAltitude, Math.min(this.maxAltitude,this.altitudeTarget));
        }
        
        this.roll =- (this.angleTarget - this.angle) * 0.4;
        this.pitch =- Math.max(-this.topPitch, Math.min(this.topPitch, this.speed));

        this.speed += (this.speedTarget - this.speed) * this.speedInertia;
        this.altitude += (this.altitudeTarget - this.altitude) * this.altitudeInertia;
        this.angle += (this.angleTarget - this.angle) * this.angleInertia;

        var directionX=Math.cos(-this.angle) * this.speed;
        var directionZ=Math.sin(-this.angle) * this.speed;

        this.positionX += +directionX;
        this.positionZ += +directionZ;        
        this.positionY = this.altitude;
    }
}