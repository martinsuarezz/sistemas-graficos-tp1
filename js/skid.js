class Skid extends Objeto3D{
    constructor(){
        super();
        let lowerPart = new SkidLowerPart();
        let bar1 = new Cylinder();
        let bar2 = new Cylinder();

        lowerPart.setPosition(0, -4, 1.3);
        lowerPart.setScale(1, 1, 0.8);
        lowerPart.setFirstRotation(Math.PI/2, [0, 1, 0]);
        lowerPart.setSecondRotation(Math.PI/2, [0, 0, 1]);
        lowerPart.setColor([0,0,0]);

        bar1.setScale(0.1, 0.1, 1);
        bar1.setPosition(4, 0, 0);
        bar1.setFirstRotation(2/5 * Math.PI, [1, 0, 0]);
        bar1.setColor([0,0,0]);

        bar2.setScale(0.1, 0.1, 1);
        bar2.setPosition(-4, 0, 0);
        bar2.setFirstRotation(2/5 * Math.PI, [1, 0, 0]);
        bar2.setColor([0,0,0]);

        this.addChild(lowerPart);
        this.addChild(bar1);
        this.addChild(bar2);
    }
}