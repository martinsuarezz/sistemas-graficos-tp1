class Tail extends Objeto3D{
    constructor(){
        super();
        this.topAngle = 0.1;

        let beam1 = new TailBeam();
        let beam2 = new TailBeam();
        let bar = new Cylinder();
        this.flap1 = new Flap();
        this.flap2 = new Flap();

        beam1.setColor([0.9, 0.82, 0.75]);
        beam1.setPosition(0, 0, 2);
        beam1.setScale(0.8, 1, 0.2);
        beam1.setFirstRotation(Math.PI, [1, 0, 0]);

        beam2.setColor([0.9, 0.82, 0.75]);
        beam2.setPosition(0, 0, -1.8);
        beam2.setScale(0.8, 1, 0.2);
        beam2.setFirstRotation(Math.PI, [1, 0, 0]);

        bar.setScale(0.2, 0.2, 0.8);
        bar.setPosition(-10, 2.5, 0);

        this.flap1.setScale(1, 1, 0.2);
        this.flap1.setColor([0.82, 0, 0]);
        this.flap1.setPosition(-12, 3, 3.5);
        this.flap1.setFirstRotation(Math.PI, [0, 1, 0]);

        this.flap2.setScale(1, 1, 0.2);
        this.flap2.setColor([0.82, 0, 0]);
        this.flap2.setPosition(-12, 3, -3.2);
        this.flap2.setFirstRotation(Math.PI, [0, 1, 0]);

        this.addChild(beam1);
        this.addChild(beam2);
        this.addChild(bar);
        this.addChild(this.flap1);
        this.addChild(this.flap2);
    }

    setFlapsAngle(angle){
        if (angle > this.topAngle)
            angle = this.topAngle;
        else if (angle < -this.topAngle)
            angle = -this.topAngle;
        this.flap1.setFirstRotation(Math.PI - angle, [0, 1, 0]);
        this.flap2.setFirstRotation(Math.PI - angle, [0, 1, 0]);
    }
}
