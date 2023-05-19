const canvas = document.getElementById("myCanvas");

canvas.width = 200;
//THe above shape makes a road type simulation. There will be space made for the neural network.

const ctx = canvas.getContext("2d");//this context will allow drawing.
const road = new Road(canvas.width/2,canvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50);
// car.update();
// car.draw(ctx);

animate();
function animate(){
    car.update(road.borders);
    canvas.height = window.innerHeight; // by doing so we clear the canvas and just keep the car.
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7); //this will give the camera effect to the car so we find as though there is a car moving. all this mainly happens due to the last line.
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate); // this actually produces so many frames per second, and we get the apparent movement.
}

//RequestAnimationFrame calls the animate method again and again many more times per second. It gives the illusion of the movement.