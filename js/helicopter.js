class Helicopter extends Objeto3D{
    constructor(){
        super();
        let cabin = new Cabin();
        let skidLeft = new Skid();
        let skidRight = new Skid();

        cabin.setScale(1.4);
        skidLeft.setPosition(0, -2.5, 3);
        skidRight.setPosition(0, -2.5, -3);
        skidRight.setRotation(0, Math.PI, 0);
        this.addChild(cabin);
        this.addChild(skidLeft);
        this.addChild(skidRight);
    }
}
