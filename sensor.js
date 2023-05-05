class Sensor{
    constructor(car) {
        this.car = car;
        this.rayCount = 3;
        this.rayLength = 100;
        this.raySpread=Math.PI/4;
        this.rays=[];
    }
    update(){

        for(let i=0; i<this.rayCount;i++){
            const rayAngle = lerp( // we need to find the angle of each individual ray. This uses the lerp function.
                //The lerp function will work because we are trying to set the initial angle to be 45 degrees (how? trick is pass the below values to lerp function with i=0).
                //then the angle increases slowly with the last one reaching over 90 degrees. Imagine the 90 degree rotated unit circle.
                this.raySpread/2,
                -this.raySpread/2,
                i/(this.rayCount-1) //the 'i' will not reach the ray count. so, this is the reason the denominator is as there.
            );
            const start = {x:this.car.x,y:this.car.y}; //The start point is the car's x and y. remember again the x and y will be the top left most part of the car.
            // We are on a browser. So, imagine the coordinate system on the browser, where 'y' axis is positive as we go down the browser.
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle)*this.rayLength,
                y: this.car.y -
                    this.rayLength * Math.cos(rayAngle)
            };
            this.rays.push([start,end]); //push these start and points into an array.
        }
        console.log(this.rays);
    }

    draw(ctx){
        for(let i=0; i<this.rayCount;i++){
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle = "yellow";//draw the rays in yellow color.
            ctx.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            ctx.lineTo(this.rays[i][1].x,this.rays[i][1].y);
            ctx.stroke();
        }
    }
}