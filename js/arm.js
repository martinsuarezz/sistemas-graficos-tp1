class Arm extends Objeto3D{
    constructor(){
        super();
        this.shieldedRotor = new ShieldedRotor();
        let bar = new Cylinder();

        this.shieldedRotor.setPosition(0, 0, -4.25);
        bar.setPosition(0, -0.5, 4.25);
        bar.setScale(0.3, 0.3, 1);
        
        this.addChild(this.shieldedRotor);
        this.addChild(bar);
    }

    setRotorSpeed(speed){
        this.shieldedRotor.setRotorSpeed(speed);
    }
}