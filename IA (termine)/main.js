//on récupère le canvas sur le document html
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 250;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 250;
//on initialise le context de dessin
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
//on initialise les variables utiles
const laneCount = 7;
const road = new Road(carCanvas.width*0.5,carCanvas.width*0.9,laneCount);
//const car = new Car(road.getLaneCenter(1), 100, 30, 50,"AI");
const N = 450;
const myCarSpeed =3.5;
const startLane=1;
const cars = generateCars(N);
const netMut = 0.2;
let carCount = cars.length;
let bestCar = cars[0];
let lastBestBrain = bestCar;
let timer = 0;
const trafficInterval = 100;
const debugMode = true;
let myCar= new Car(road.getLaneCenter(4), 100, 30, 50,"KEYS",5);


if (localStorage.getItem("bestBrain")) { 
    for (let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain,netMut);
            console.log(cars[i].brain);
        }
    }
    
}
const traffic = [
    new Car(road.getLaneCenter(startLane),310,30,50,"DUMMY",myCarSpeed-0.2),
    new Car(road.getLaneCenter(startLane),-150,30,50,"DUMMY",myCarSpeed-1+Math.random() * 0.5),
];
function handleTraffic() {
    
    if (timer % trafficInterval === 0) {
        //console.log(timer);
        let lane = Math.floor(Math.random() * laneCount);
        let lane2 = Math.floor(Math.random() * laneCount);
        let lane3= Math.floor(Math.random()*laneCount);
        if(lane == lane2)lane2+1;
        if(lane == lane3)lane3-1;
            traffic.push(
                new Car(road.getLaneCenter(lane),
                    bestCar-300,//-bestCar.y-carCanvas.height*0.5-Math.random()*-550,
                    30,
                    50,
                    "DUMMY",
                    Math.random() * 2.5
                )); 
            traffic.push(
                new Car(
                    road.getLaneCenter(lane2),
                    bestCar.y - (300 + carCanvas.height * 0.5 + Math.random() * 50),
                    30,
                    50,
                    "DUMMY",
                    Math.random() * 2+0.5,
                    
                ));traffic.push(
                new Car(
                    road.getLaneCenter(lane3),
                    bestCar.y-(300+carCanvas.height*0.5),
                    30,
                    50,
                    "DUMMY",
                    Math.random() * 2+0.5,
                    
                ));  
            //console.log(traffic);
            traffic.forEach(object => {
                if (object.y > 7000||object.y<-10000) {
                    traffic.pop(object);
                }
            });
        }
    }


animate(0); 
let bestCandidate = [];
function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
    bestCandidate.push(JSON.stringify([bestCar.brain]));
    console.table(bestCandidate);
}
function discard() {
    console.table(localStorage);
    localStorage.removeItem("bestBrain");
}
function generateCars(N) {
        const cars = [];
        for (let i = 1; i < N; i++){
            cars.push(new Car(road.getLaneCenter(startLane), 100, 30, 50,"AI",myCarSpeed));
        }
        return cars;
}
  
function animate(time) {
    //console.log(timer);
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    //on met le traffic
    handleTraffic();
    for (let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
  
    }
    //on met a jours 
    for (let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }
    myCar.update(road.borders, traffic);
    //on selectionne la voiture la plus en avant
    bestCar = cars.find(c => c.y == Math.min(
        ...cars.map(c => c.y)
    ));
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    //on suit la voiture avec le canvas
    carCtx.save(); 
    carCtx.translate(0,-bestCar.y +carCanvas.height*0.65);
    road.draw(carCtx);
    //on dessine e traffic
    for (let i = 0; i < traffic.length; i++){
        let randomColor = 'hsl(' + i*100 + ',90%,80%)'; 
        traffic[i].draw(carCtx,randomColor);
    }
    carCtx.globalAlpha=0.3;
    for (let i = 0; i < cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    
    bestCar.draw(carCtx, "blue", true);
    lastBestBrain.draw(carCtx,"green",true);
    myCar.draw(carCtx,"black",true);
    
    carCtx.restore();

    networkCtx.save();
    networkCtx.fillStyle = 'yellow';
    networkCtx.fillText("Time " + Math.floor(time * 0.001), 5, 10);
    networkCtx.restore();
    networkCtx.lineDashOffset = -time / 30;
    
    
   //on dessine le cerveau sur le canvas brain 
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    timer++;
    requestAnimationFrame(animate);
}


