class ShieldedRotor extends Objeto3D{
    constructor(){
        super();
        this.rotor = new Rotor();
        let shield = new RotorShield();

        shield.setScale(0.6);
        shield.setPosition(0, -0.5, 0);
        shield.setColor([0.82, 0, 0]);

        this.addChild(this.rotor);
        this.addChild(shield);

        this.rotationAngle = 0;
    }

    setRotorSpeed(speed, time){
        this.rotationAngle += time * 4;
        this.rotationAngle += Math.abs(speed) * time * 5;
        this.rotor.setFirstRotation(this.rotationAngle, [0, 1, 0]);
    }
}
