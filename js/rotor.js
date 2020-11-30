class Rotor extends Objeto3D{
    constructor(bladesAmmount = 12){
        super();
        let centralAxis = new Cylinder();

        centralAxis.setScale(0.3, 0.3, 0.45);
        centralAxis.setFirstRotation(Math.PI/2, [1, 0, 0]);
        centralAxis.setPosition(0, -0.5, 0);

        for (let i = 0; i < bladesAmmount; i++){
            let blade = new Blade();
            blade.setScale(2, 3, 2);
            blade.setFirstRotation(Math.PI/2, [1, 0, 0]);
            blade.setSecondRotation(i * 2 * Math.PI / bladesAmmount, [0, 0, 1]);
            blade.setThirdRotation(Math.PI/4, [0, 1, 0]);
            blade.setColor([0.6, 0.6, 0.6]);
            this.addChild(blade);
        }

        this.addChild(centralAxis);
    }
}