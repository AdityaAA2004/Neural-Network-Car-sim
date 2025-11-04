class Road{
    constructor(x,width,laneCount=3) {
        this.x = x;
        this.width = width;
        this.laneCount=laneCount;
        this.left = x - width/2;
        this.right = x + width/2;
        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;
        //remember, the browser screen always grows downwards or becomes positive downwards.
        //It becomes negative going upward.
        const topLeft = {x:this.left,y:this.top} // understand that each of these are technically JSON objects.
        //Mathematically these are points. Also, we have defined these points' numerical values before.
        const topRight = {x:this.right,y:this.top}
        const bottomRight = {x:this.right,y:this.bottom}
        const bottomLeft = {x:this.left,y:this.bottom}
        this.borders = [// the roadBorders parameter defined everywhere.
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ]
    }

    getLaneCenter(laneIndex){ //this finds the center of a particular lane.
        const laneWidth = this.width/this.laneCount; //it finds the lane width by dividing the road width by the number of lanes.
        return this.left + laneWidth/2 + Math.min(laneIndex,this.laneCount-1)*laneWidth;
        // this will make the car move only in the last lane even if we mention more than that. Understand that the lanes are counted from 0.
    }

    draw(ctx){
        ctx.lineWidth = 5; // the width of each lane marking
        ctx.strokeStyle= "white";//white color lanes.
        for(let i=1; i<=this.laneCount-1;i++) {//notice how we start and end the loop.
            //this enables us to make the lines dotted or dashed just in between the borders.
            const x = lerp( // find the correct horizontal points to draw the lanes using LERP function.
                this.left,
                this.right,
                i / this.laneCount
            );
            ctx.setLineDash([20,20]); //set the lane dash distance.
            ctx.beginPath();
            ctx.moveTo(x, this.top);//start from the point (x,top).
            ctx.lineTo(x, this.bottom);//draw the line upto (x,bottom).
            ctx.stroke();

        }
        //now coming to the borders.
        ctx.setLineDash([]);//these lines are and should be solid.
        this.borders.forEach(border=>
        {
            ctx.beginPath(); //begin the path.
            ctx.moveTo(border[0].x,border[0].y);//move to the first point in the loop
            ctx.lineTo(border[1].x,border[1].y);//move to second point in the loop.
            ctx.stroke();
        })

    }

}