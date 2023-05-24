class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3) { // the last two parameters in the constructor helps to set Dummy traffic cars in such a way, that the actual driver can catch the dummy car.
        this.x = x;
        this.y =y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.acceleration = 0.2; //some fixed value.
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.useBrain = controlType === "AI"
        if(controlType!=="DUMMY") {
            this.sensor = new Sensor(this); //sensors for the car. The dummy cars dont need a sensor.
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            ); // the middle number is an inner hidden layer.
            // The outer-most layer has 4 neurons for all 4 directions (Forward, Backward, Right, Left)
        }
        this.controls = new Controls(controlType);
        this.damaged = false;//initially not damaged.


    }

    update(roadBorders,traffic){
        if (!this.damaged) {//make only an undamaged car move.
            this.#move();
            this.polygon = this.#createPolygon();//draw out the shape of the car.
            this.damaged = this.#assessDamage(roadBorders,traffic);//check the damage
        }
        if(this.sensor) {//only if the sensor exists it needs to be updated.
            this.sensor.update(roadBorders, traffic);//update sensors of the car.
            const offsets = this.sensor.readings.map(s=>s==null?0:1-s.offset);
            // if object is far away, neurons receive low values.
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            // console.log(outputs);
            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }


    }

    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }

        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true; //note in the above polysIntersect method call, we initially (for road borders) passed the roadBorders[i], because that itself is a list of points.
                //here, in case of each traffic car, the polygon contains the list of points used to draw the car. Hence, only the polygon property is passed.
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

    draw(ctx,color,drawSensor=false){ // this is to check if sensor should be drawn.
        if(this.damaged){
            ctx.fillStyle="gray"; // this is if car is damaged
        }
        else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for (let i=1; i < this.polygon.length; i++){
            //we are starting loop from 1 because we have moved to the 0th point. line to the ith polygon polygons.
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor && drawSensor) //a sensor should be drawn only if it exists.
            this.sensor.draw(ctx);
    }
}