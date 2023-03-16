
window.addEventListener('load', function () {
    //on récupère le canvas sur le document html
    const container = document.getElementById('container');
    const canvas = document.getElementById("canvas2");
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    //on initialise les variables utiles
    let particleArray = [];
    let adjustX = 0;
    let adjustY = 150;
    let size = 1.5;
    const mouse = {
        x: null,
        y: null,
        width: 30,
        height: 300,
        radius:50,
    }
    window.addEventListener('resize', function () {
        canvasPosition = canvas.getBoundingClientRect();
    });
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
        //console.log(mouse.x,mouse.y);
    });


    ctx.fillStyle = 'rgba(255,214,0,1)';
    ctx.font = "30px Verdana"
    ctx.fillText("MY WEBSITE", 50, 50);
    const textCoordinate = ctx.getImageData(0, 0,800, 200);
    
    class Particle{
        constructor(x, y,color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = 1;
            this.baseX=this.x;
            this.baseY = this.y;
            this.density = (Math.random()*40)+5;
            
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            

            
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance ;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx *0.1;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy *0.1;
                }
            }
        }
    }
    function init() {
        particleArray = [];
        for (let y = 0,  y2 = textCoordinate.height; y < y2; y++) {
            for (let x = 0, x2 = textCoordinate.width; x < x2; x++){
                if (textCoordinate.data[(y * 4 *textCoordinate.width)+(x*4)+3] > 128) {
                    let positionX = x + adjustX;
                    let positionY = y + adjustY;
                    //facteur d agrandissement
                    particleArray.push(new Particle(
                        positionX*size, 
                        positionY*size,
                        'rgba(255,214,0,0.5)'
                        ));
                }
            }
        }
        //console.log(textCoordinate);
        /*for (let i = 0; i < 500; i++){
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particleArray.push(new Particle(x, y));
        }*/
        
    } 
    init(); 
    //console.log(particleArray);

    function animate() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particleArray.length; i++){
            particleArray[i].draw();
            particleArray[i].update();
            
        }
        requestAnimationFrame(animate);
    }
    animate();
    


    
});

   