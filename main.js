const carCanvas = document.getElementById("carCanvas"); //get the canvas element in the HTML

carCanvas.width = 200; // fix the width of the element.
//THe above shape makes a road type simulation. There will be space made for the neural network.
const networkCanvas = document.getElementById("networkCanvas"); //get the canvas element in the HTML

networkCanvas.width = 300; // fix the width of the element.


const carCtx = carCanvas.getContext("2d");//this context will allow drawing.
const networkCtx = networkCanvas.getContext("2d");//this context will allow drawing.

const road = new Road(carCanvas.width/2,carCanvas.width*0.9); //start the car at default position to be the center of the road.
// the 'width' parameter is basically  the effective or drivable road.
const N = 100;

const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")){
    for (let i=0; i<cars.length;i++){
      cars[i] = JSON.parse(
          localStorage.getItem("bestBrain")
      );
      if (i !== 0){
          NeuralNetwork.mutate(cars[i].brain,0.1);
      }
    }

}
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),


];

// car.update();
// car.draw(ctx);

animate();

function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars = [];
    for (let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}
function animate(time){
    for(let i=0;i<traffic.length;i++){//this loop is for the cars counted as traffic.
        traffic[i].update(road.borders,[]); // hence the traffic parameter is empty.
    }
    for (let i=0; i< cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    const bestCar = cars.find(
        c=>c.y === Math.min(...cars.map(c=>c.y))
    ); // in this line of code, we have to find the best car, so we have to find the car that has minimum  y value.
    //So, inside the first find method, we again map the cars array to find all y values. then, put them into the Math.min function using the three dots.

    carCanvas.height = window.innerHeight; // by doing so we clear the canvas and just keep the car.
    networkCanvas.height = window.innerHeight; // by doing so we clear the canvas and just keep the car.

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7); //this will give the camera effect to the car so we find as though there is a car moving. all this mainly happens due to the last line.
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha = 0.2; // initially, to avoid the overlap of cars, the global transparency or alpha is set to a very low value.
    for (let i=0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue",true); // this car is drawn again for more emphasis.
    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    requestAnimationFrame(animate); // this actually produces so many frames per second, and we get the apparent movement.
}

//RequestAnimationFrame calls the animate method again and again many more times per second. It gives the illusion of the movement.