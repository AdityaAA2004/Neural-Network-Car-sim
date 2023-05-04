class Car{
    constructor(x,y,width,height) {
        this.x = x;
        this.y =y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.acceleration = 0.2; //some fixed value.
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0.03;
        this.controls = new Controls();
    }

    update(){
        this.#move();

    }

    #move(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if (this.controls.reverse){
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed){ //in forward direction
            this.speed=this.maxSpeed;
        }

        if (this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2; // there is no negative speed. it is just that the car is going backwards.
        }

        if (this.speed > 0){ //in forward direction, the car slows down due to friction.

            this.speed -= this.friction;

        }

        else{ // in backward direction as well, the car will slow down by friction.

            this.speed += this.friction;
        }

        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }
        if(this.speed !== 0) {
            const flip = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }

            if (Math.abs(this.speed) <= this.friction) {
                this.speed = 0;
            }
        }
        // take a note. Here, the unit circle is rotated by 90 degrees. Hence, our thing makes sense.
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;

    }


    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(
            - this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore();
        //the restore method will bring back normal state.
    }
}