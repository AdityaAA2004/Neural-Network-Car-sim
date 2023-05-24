const carCanvas = document.getElementById("carCanvas"); //get the canvas element in the HTML

carCanvas.width = 200; // fix the width of the element.
//THe above shape makes a road type simulation. There will be space made for the neural network.
const networkCanvas = document.getElementById("networkCanvas"); //get the canvas element in the HTML

networkCanvas.width = 300; // fix the width of the element.


const carCtx = carCanvas.getContext("2d");//this context will allow drawing.
const networkCtx = networkCanvas.getContext("2d");//this context will allow drawing.

const road = new Road(carCanvas.width/2,carCanvas.width*0.9); //start the car at default position to be the center of the road.
// the 'width' parameter is basically  the effective or drivable road.
const car = new Car(road.getLaneCenter(1),100,30,50,"AI");
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
];

// car.update();
// car.draw(ctx);

animate();
function animate(){
    for(let i=0;i<traffic.length;i++){//this loop is for the cars counted as traffic.
        traffic[i].update(road.borders,[]); // hence the traffic parameter is empty.
    }
    car.update(road.borders,traffic);
    carCanvas.height = window.innerHeight; // by doing so we clear the canvas and just keep the car.
    networkCanvas.height = window.innerHeight; // by doing so we clear the canvas and just keep the car.

    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.7); //this will give the camera effect to the car so we find as though there is a car moving. all this mainly happens due to the last line.
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    car.draw(carCtx,"blue");

    Visualizer.drawNetwork(networkCtx,car.brain);
    networkCtx.lineDashOffset = time;
    requestAnimationFrame(animate); // this actually produces so many frames per second, and we get the apparent movement.
}

//RequestAnimationFrame calls the animate method again and again many more times per second. It gives the illusion of the movement.