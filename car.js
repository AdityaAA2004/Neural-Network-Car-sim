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
        this.angle = 0;
        this.sensor = new Sensor(this);
        this.controls = new Controls();
        this.damaged = false;
    }

    update(roadBorders){
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders);
        }
        this.sensor.update(roadBorders);

    }

    #assessDamage(roadBorders){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.height,this.width)/2; // this is the radius of the car.
        const alpha = Math.atan2(this.width,this.height);
        //the first object notation is the right top end of the car.
        //the second object notation is the left top end of the car.
        //the third one is for left bottom end.
        //the fourth one is for right bottom end.
        points.push({
            x: this.x - (Math.sin(this.angle - alpha) * rad),
            y: this.y - (Math.cos(this.angle - alpha) * rad)
        });
        points.push({
            x: this.x - (Math.sin(this.angle + alpha) * rad),
            y: this.y - (Math.cos(this.angle + alpha) * rad)
        });
        points.push({
            x: this.x - (Math.sin(Math.PI + this.angle - alpha) * rad),
            y: this.y - (Math.cos(Math.PI + this.angle - alpha) * rad)
        });

        points.push({
            x: this.x - (Math.sin(Math.PI + this.angle + alpha) * rad),
            y: this.y - (Math.cos(Math.PI + this.angle + alpha) * rad)
        });

        return points;
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

    //
    // draw(ctx){
    //     ctx.save();
    //     ctx.translate(this.x,this.y);
    //     ctx.rotate(-this.angle);
    //     ctx.beginPath();
    //     ctx.rect(
    //         - this.width/2,
    //         -this.height/2,
    //         this.width,
    //         this.height
    //     );
    //     ctx.fill();
    //     ctx.restore();
    //     //the restore method will bring back normal state.
    //     this.sensor.draw(ctx);
    // }

    draw(ctx){
        if(this.damaged){
            ctx.fillStyle="gray";

        }
        else{
            ctx.fillStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for (let i=1; i < this.polygon.length; i++){
            //we are starting loop from 1 because we have moved to the 0th point. line to the ith polygon polygons.
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        this.sensor.draw(ctx);
    }
}