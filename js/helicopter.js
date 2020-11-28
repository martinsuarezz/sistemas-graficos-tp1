class Helicopter extends Objeto3D{
    constructor(){
        super();
        this.topArmPitch = 0.5;

        let cabin = new Cabin();
        let skidLeft = new Skid();
        let skidRight = new Skid();
        this.arm1 = new Arm();
        this.arm2 = new Arm();

        cabin.setScale(1.4);
        skidLeft.setPosition(0, -2.5, 3);
        skidRight.setPosition(0, -2.5, -3);
        skidRight.setFirstRotation(Math.PI, [0, 1, 0]);
        this.arm1.setScale(0.5);
        this.arm1.setPosition(-3, 1, -8);
        this.arm2.setScale(0.5);
        this.arm2.setFirstRotation(Math.PI, [0, 1, 0]);
        this.arm2.setPosition(-3, 1, 8);
        this.addChild(this.arm1);
        this.addChild(this.arm2);
        this.addChild(cabin);
        this.addChild(skidLeft);
        this.addChild(skidRight);

        this.controller = new HelicopterController();
    }

    setRotationAngles(roll, angle, pitch){
        this.setFirstRotation(roll, [1, 0, 0]);
        this.setSecondRotation(angle, [0, 1, 0]);
        this.setThirdRotation(pitch, [0, 0, 1]);
    }

    setArmsSpeed(speed, time){
        this.arm1.setRotorSpeed(speed, time);
        this.arm2.setRotorSpeed(speed, time);
        let armPitch = speed * 2;
        if (armPitch > this.topArmPitch)
            armPitch = this.topArmPitch;
        if (armPitch < -this.topArmPitch)
            armPitch = -this.topArmPitch;
        this.arm1.setFirstRotation(-armPitch, [0, 0, 1]);
        this.arm2.setSecondRotation(armPitch, [0, 0, 1]);
    }

    actualizarMatricesModeladoHijos(){
        for (let i = 0; i < this.hijos.length; i++){
            this.hijos[i].actualizarMatrizModelado(this.matrizModelado);
        }
    }
    
    tick(time){
        this.controller.tick();
        this.setPosition(...this.controller.getPosition());
        this.setRotationAngles(...this.controller.getRotation());
        this.actualizarMatrizModelado();
        this.actualizarMatricesModeladoHijos();
        this.setArmsSpeed(this.controller.getSpeed(), time);
    }

}
