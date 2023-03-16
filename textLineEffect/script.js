
window.addEventListener('load', function () {
    //on récupère le canvas sur le document html
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 900;
    //on initialise les variables utiles
    ctx.lineWidth = 5;
    
    const gradient1 = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    gradient1.addColorStop('0.2', 'pink',);
    gradient1.addColorStop('0.3','red',);
    gradient1.addColorStop('0.4', 'yellow',);
    gradient1.addColorStop('0.5', 'orange',);
    gradient1.addColorStop('0.6', 'green',);
    gradient1.addColorStop('0.7', 'turquoise',);
    gradient1.addColorStop('0.8', 'blue',);
    gradient1.addColorStop('1', 'black',);
    
    const gradient2 = ctx.createRadialGradient( canvas.width * 0.5, canvas.height * 0.5, 10, canvas.width * 0.5, canvas.height * 0.5, 300);
    gradient2.addColorStop('0', 'red',);
    gradient2.addColorStop('0.5', 'white',);
    gradient2.addColorStop('1', 'black',);
    
// canvas pattern
    
    const patternImage = this.document.getElementById('patternImage');
    const pattern1 = ctx.createPattern(patternImage, 'no-repeat');
    ctx.strokeStyle = pattern1;
    //ctx.shadowOffsetX = 2;
    //ctx.shadowOffsetY = 2;
    
    ctx.shadowColor = 'white';
    class Line{
        constructor(canvas) {
            this.canvas = canvas;
            //this.startX = Math.random() * this.canvas.width;
            //this.startY = Math.random() * this.canvas.height;
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            //this.endX = Math.random() * this.canvas.width;
            //this.endY = Math.random() * this.canvas.height;
            this.history = [{
                x: this.x,
                y: this.y
            }];
            this.lineWidth = Math.floor(Math.random() * 20 + 3);
            this.hue = Math.floor(Math.random() * 360);
            this.maxLenght = Math.floor(Math.random() * 150+10);
            this.speedX = Math.random() * 0.5 - 0.5;
            this.speedY = 15;
            this.lifeSpan = this.maxLenght * 3; 
            this.breakPoint = this.lifeSpan* 0.7;
            this.timer = 0;
            this.angle = 0;
            this.va = Math.random() * 0.5 - 0.25;
            this.curve = 0.1;
            this.cv =Math.random()*0.4-0.2;
            
        }
        draw(context) {
            //console.log(this.history.x);
            //context.strokeStyle = 'hsl('+this.hue+',70%,50%)';
            context.lineWidth = this.lineWidth;
            context.beginPath();
            context.moveTo(this.history[0].x, this.history[0].y);
            /*for (let i = 0; i < 3; i++){
                this.x = Math.random() * this.canvas.width;
                this.y = Math.random() * this.canvas.height;
                this.history.push({x:this.x, y:this.y});
            }*/
            
            for (let i = 0; i < this.history.length; i++){
                context.lineTo(this.history[i].x, this.history[i].y);
            }

            
            context.stroke();
        }
        update() {
            this.timer++;
            this.angle += this.va;
            this.curve += this.cv;
            if (this.timer < this.lifeSpan) {
                if (this.timer > this.breakPoint) {
                    this.va *= 1.12;
                }
                this.x += Math.sin(this.angle) * this.curve;//this.speedX + Math.random() * 50 - 25;
                this.y += Math.cos(this.angle) * this.curve;
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.maxLenght) {
                    this.history.shift();
                }
            } else if(this.history.length <=1) {
                this.reset();
            }else {
                this.history.shift();
            }
            
        }
        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.history = [{
                x: this.x,
                y: this.y
            }];
            this.timer = 0;
            this.angle = 0;
            this.curve = 0;
            //this.va = Math.random() * 0.5 - 0.25;
        }
        
    }
    const lineArray = [];
    const lineNumber = 50;
    for (let i = 0; i < lineNumber; i++){
        lineArray.push(new Line(canvas));
    }
    
    
    

   /* const mouse = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        radius:100,
    }
    this.window.addEventListener('mousemove', (e) => {
        mouse.x = e.x + canvas.clientLeft * 0.5;
        mouse.y = e.y + canvas.clientTop * 0.5;
    });*/
   
    //Animer  et mettre a jour
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //draw line
        lineArray.forEach(line => { line.draw(ctx); line.update(); });
        //update line
        requestAnimationFrame(animate);

    }
    
    animate();

});

   
