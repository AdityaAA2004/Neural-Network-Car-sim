const canvas = document.getElementById("myCanvas");

canvas.width = 200;
//THe above shape makes a road type simulation. There will be space made for the neural network.

const ctx = canvas.getContext("2d");//this context will allow drawing.
const road = new Road(canvas.width/2,canvas.width*0.9);
const car = new Car(100,100,30,50);
car.draw(ctx);

animate();
function animate(){
    car.update();
    canvas.height = window.innerHeight; // by doing so we clear the canvas and just keep the car.
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate); // this actually produces so many frames per second, and we get the apparent movement.
}

//RequestAnimationFrame calls the animate method again and again many more times per second. It gives the illusion of the movement.