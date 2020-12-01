class LandingPad extends Objeto3D{
    constructor(){
        super();
        let box = new Box();
        box.setColor([0.7, 0.7, 0.7]);
        this.addChild(box);
    }
}
