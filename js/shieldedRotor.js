class ShieldedRotor extends Objeto3D{
    constructor(){
        super();
        this.rotor = new Rotor();
        let shield = new RotorShield();

        shield.setScale(0.6);
        shield.setPosition(0, -0.5, 0);

        this.addChild(this.rotor);
        this.addChild(shield);
    }

    setRotorSpeed(speed){
        this.rotor.setFirstRotation(speed, [0, 1, 0]);
    }
}