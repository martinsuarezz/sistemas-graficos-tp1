class Arm extends Objeto3D{
    constructor(){
        super();
        this.shieldedRotor = new ShieldedRotor();
        let bar = new Cylinder();
        let axis = new Cylinder();

        this.shieldedRotor.setPosition(0, 0, -18);
        this.shieldedRotor.setScale(1.75);

        bar.setPosition(0, -0.5, 4.25);
        bar.setScale(0.6, 0.6, 3.5);
        bar.setColor([1,1,1]);

        axis.setFirstRotation(Math.PI / 2, [0, 1, 0]);
        axis.setPosition(0, -0.5, 4.25);
        axis.setColor([0.4, 0.4, 0.4]);
        
        this.addChild(this.shieldedRotor);
        this.addChild(bar);
        this.addChild(axis);
    }

    setRotorSpeed(speed, time){
        this.shieldedRotor.setRotorSpeed(speed, time);
    }
}