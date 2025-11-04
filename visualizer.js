class Visualizer{
    static drawNetwork(ctx,network){
        const margin=50; //amount of margin
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;

        const levelHeight=height/network.levels.length; // this is the height of each level.

        for(let i=network.levels.length - 1;i>=0;i--){ // this should be looping in reverse so that we can prevent overdrawing of the top output nodes.
            const levelTop=top+
                lerp( // interpolate between the height and the level height.
                    //this allows usw to start the bottom level at the y value that is still fit to screen.
                    height-levelHeight,
                    0,
                    network.levels.length === 1
                        ?0.5 //if there is just one level to draw.
                        :i/(network.levels.length-1)
                );

            ctx.setLineDash([7,3]); // a line of 7 pixels and spacing of 3 px.
            Visualizer.drawLevel(ctx,network.levels[i],
                left,levelTop,
                width,levelHeight,
                i === network.levels.length-1 //we are the last level.
                    ?['🠉','🠈','🠊','🠋'] // this just search online for symbols.
                    :[] // no symbols for intermediate levels.
            );
        }
    }

    static drawLevel(ctx,level,left,top,width,height,outputLabels){
        const right=left+width;
        const bottom=top+height;

        const {inputs,outputs,weights,biases}=level; //this means we use inputs directly.
// tha bove step is also called destructuring step.
        for(let i=0;i<inputs.length;i++){// this is for the connections in between.
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs,i,left,right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs,j,left,right),
                    top
                );
                ctx.lineWidth=2;
                ctx.strokeStyle=getRGBA(weights[i][j]); // this is for the color of the line. In here, the weight will actually make the line brighter or dimmer.
                ctx.stroke();
            }
        }

        const nodeRadius=18; // node size is 18.
        for(let i=0;i<inputs.length;i++){
            const x=Visualizer.#getNodeX(inputs,i,left,right); //find the node's X-coordinate.
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            //this is to draw the node circle.
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(inputs[i]); // this is for actual inputs.
            ctx.fill();
        }

        for(let i=0;i<outputs.length;i++){
            const x=Visualizer.#getNodeX(outputs,i,left,right);
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="black"; // this actually allows the connections or biases not to form their own circle
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(outputs[i]); // for the actual output values.
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.strokeStyle=getRGBA(biases[i]); // this is for the transparency of output lines.
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){ // if there are labels.
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillStyle="black";
                ctx.strokeStyle="white";
                ctx.font=(nodeRadius*1.5)+"px Arial";
                ctx.fillText(outputLabels[i],x,top+nodeRadius*0.1); // Just to center the output symbols.
                ctx.lineWidth=0.5;
                ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.1);
            }
        }
    }

    static #getNodeX(nodes,index,left,right){ // This is a helper function to avoid repitition.
        return lerp(
            left,
            right,
            nodes.length === 1
                ?0.5
                :index/(nodes.length-1)
        );
    }
}

function getRGBA(value){
    const alpha=Math.abs(value); // alpha is the transparency determined by weights.
    const R=value<0?0:255; // R for red.
    const G=R;
    const B=value>0?0:255; // B for blue
    return "rgba("+R+","+G+","+B+","+alpha+")";
}
// the above function is actually a utility function.