class Car{
    constructor(x, y, width, height,controlType,maxSpeed=3) {
        this.x=x;
        this.y = y;
        this.image = new Image();
        this.image.src = "img/cars_miniTransp.png";
        this.width=width;
        this.height = height;
        this.controlType = controlType;
        //Vitesse physique
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        this.useBrain = controlType == "AI";
        this.neuroLevel1 = 8;
        this.neuroLevel2 = 5;
        this.neuroLevel3 = 7;
        this.neuroLevel4 = 5;
        
        this.actuator = 4;
        this.discalified = false;

        //this.sensor = new Sensors(this);
        //AI and user conrols
        if (controlType != "DUMMY") {//si on est pas un dummy
            this.sensor = new Sensors(this);//on a des sensors
            this.brain = new NeuralNetwork(//on a un cerveau
                [this.sensor.rayCount, 
                    this.neuroLevel1,
                    this.neuroLevel2,
                    this.neuroLevel3,
                    this.neuroLevel4,
                    this.actuator]
            );
        }
//responsabilité des controles sur l objet
//acces a controls
        this.controls = new Controls(controlType);
        
    }
    update(roadBorders,traffic) {
        //si on est pas damaged
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assesDamage(roadBorders,traffic);
        } if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            //console.log(outputs);
            //console.log(offsets[0]);
            //debugger;
            //Array(25) [ 0, 0, 0, 0, 0.19701017971203794, 0.3383949783888286, 0.40284292721739956, 0.4198208092775356, 0.3958246787483811, 0.3215262321502732, … ]
/*console.table() car.js:50:21
(index):Valeurs
0:capteur arriere
1:arr gauche arr+1
2:0
3:0.18410756016936825
4:0.33382661247350864
5:0.40272528053264445
6:0.42307692307692313
7:0.40272528053264434
8:0.33382661247350875
9:0.18410756016936813
10:0
11:av gauche capteur avant -1
12:capteur avant = [0]+offsets.lenght/2
13:av droit capteur avant +1
14:0
15:0.18410756016936813
16:0.33382661247350853
17:0.40272528053264434
18:0.42307692307692313
19:0.40272528053264456
20:0.33382661247350853
21:0.18410756016936813
22:0
23:0
24:arr droit arr-1*/
            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
                 
            traffic.forEach(car => {
                if (this.controlType=="DUMMY") {
                    if(this.y <= car.y+car.height*2.5){
                        this.controls.forward = false;
                        this.y = car.y+car.height*2.5;
                    }else{
                        this.controls.forward=true;
                    }
                }  
            });
        
        /*if (this.y < 0 - this.height || this.y >= carCanvas.height) {
            this.discalified = true;
        }
        if(traffic[i].x<traffic[i+1]+traffic[i].height*0.5||
            traffic[i].x>traffic[i+1]-traffic[i].height*0.5){
                traffic[i].maxSpeed = traffic[i+1].maxSpeed;
            }*/
        
        

    }
    #assesDamage(roadBorders,traffic) {
        
        for (let i = 0; i < roadBorders.length; i++){
            if (polyIntersect(this.polygon, roadBorders[i])) {
                return true; 
                
                
            }
        }
        for (let i = 0; i < traffic.length; i++){
            if (polyIntersect(this.polygon, traffic[i].polygon)) {
                return true; 
    
            }
        }
        return false;
        
    }
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha)*rad,
            y: this.y - Math.cos(this.angle - alpha)*rad
            });
            points.push({
            x: this.x - Math.sin(this.angle + alpha)*rad,
            y: this.y - Math.cos(this.angle + alpha)*rad
            });
            points.push({
            x: this.x - Math.sin(Math.PI+this.angle - alpha)*rad,
            y: this.y - Math.cos(Math.PI+this.angle - alpha)*rad
            });
            points.push({
            x: this.x - Math.sin(Math.PI+this.angle + alpha)*rad,
            y: this.y - Math.cos(Math.PI+this.angle + alpha)*rad
            });
        return points;
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
             this.speed -= this.acceleration
        }
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;    
        }
        if (this.speed < -this.maxSpeed*0.5) {
            this.speed = -this.maxSpeed*0.5;    
        }
        if (this.speed >0) {
            this.speed -= this.friction;    
        }
        if (this.speed <0) {
            this.speed += this.friction;    
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
            this.angle += 0.03*flip;
            //this.angle += this.acceleration;
            }
            if (this.controls.right) {
                this.angle -= 0.03*flip;
                //this.angle += this.acceleration;
            }
        }
        
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    
    draw(ctx,color,drawSensor=false) {
        
        if (this.damaged) {
            ctx.fillStyle = 'grey';
            
            //console.log('collision');

        }else{
            ctx.fillStyle = color;
            
        }
        if (this.sensor&& drawSensor&& debugMode) {
            this.sensor.draw(ctx);
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.drawImage(this.image,- this.width * 0.5-4.5,- this.height * 0.5-2, this.width*1.3, this.height*1.1);
        ctx.restore();
        /*ctx.beginPath();
        ctx.rect(
            -this.width*0.5,
            -this.height*0.5,
            this.width,
            this.height
        ); 
        ctx.fill();
        */
        
        
    }
}