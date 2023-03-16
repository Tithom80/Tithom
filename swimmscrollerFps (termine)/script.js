
window.addEventListener('load', function () {
    //on récupère le canvas sur le document html
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 500;
    //on initialise les variables utiles
    
    class InputHandler{
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', (e) => {
                if ((e.key === "ArrowUp" ||
                    e.key === "ArrowDown" ||
                    e.key === "ArrowRight" ||
                    e.key === "ArrowLeft") &&
                    this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === " ") {
                    this.game.player.shootTop();
                    //console.log(this.game.player.projectiles);
                } else if (e.key === 'd') {
                    this.game.debugMode = !this.game.debugMode;
                }
           
                //console.log(this.game.keys);
            });
            window.addEventListener('keyup', (e) => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }

                //console.log(this.game.keys);
            });
            const mouse = {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                radius: 100,
            }
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.x + canvas.clientLeft * 0.5;
                mouse.y = e.y + canvas.clientTop * 0.5;
            });
        }
     }
    class Projectile{
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 15;
            this.height = 8;
            this.radius = 10;
            this.angle = 0;
            this.speed = 3;
            this.markedForDeletion = false;
            this.range = 0.95;
            this.image = document.getElementById('projectile');
            
            
        }
        update() {
            this.x += this.speed; 
            if (this.x > this.game.width * this.range) this.markedForDeletion = true;
        }
        draw(context) {
            context.fillStyle = 'yellow';
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,this.x, this.y, this.width, this.height);
         }
     }
    class Particle{ 
        constructor(game,x,y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById("gears");
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.2 + 0.25).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.spriteWidth = this.spriteSize;//this.image.width / 3;
            this.spriteHeight = this.spriteSize; //this.image.height / 3;
            this.width = this.size;
            this.height = this.size;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * - 15;
            this.gravity = 0.5;
            this.angle = 0;
            this.va = 0.5+Math.random() * 0.2 + 0.1;
            this.markedForDeletion = false; 
            this.bounced = false;
            this.bottomBounceBoundary = Math.random()*80+40;


        }
        
        update() {
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;
            if (this.y > this.game.height + this.size || this.x < 0 - this.size) {
                this.markedForDeletion = true;
            }
            if (this.y > this.game.height - this.bottomBounceBoundary) {
                this.bounced = true;
                this.speedY *= -0.6;
            }
        }
        draw(context) {
            context.save();
            //rotation
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.size*-0.5,
                this.size * -0.5,
                this.width,
                this.height);
            context.restore();
            
            
            
             
            
        }
        
        
        
    }
    
    class Player{ 
        constructor(game) {
            this.game = game;
            this.image = document.getElementById('player');
            this.width = 120;
            this.height = 190;
            this.radius = this.width;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrames = 38;
            this.speedX = 0;
            this.speedY = 0; 
            this.maxSpeed = 2;
            this.projectiles = [];
            this.health = 100;
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit =10000;
            
            
        }
        update(deltaTime) {
            this.y += this.speedY;
            this.x += this.speedX;
            // animation
            if (this.frameX < this.maxFrames) this.frameX++;
            else this.frameX = 0;
            // movement
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            if (this.game.keys.includes('ArrowLeft')) this.speedX = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowRight')) this.speedX = this.maxSpeed;
            else this.speedX = 0;
            //boundaries
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x > this.game.width - this.width) {
                this.x = this.game.width - this.width;
            }
            if (this.y < 0) {
                this.y = 0;
            } else if (this.y > this.game.height - this.height*0.5) {
                this.y = this.game.height - this.height*0.5;
            }
            //handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            // powerUp
            if (this.powerUp) {
                if (this.powerUpTimer > this.powerUpLimit) {
                    this.powerUpTimer = 0;
                    this.frameY = 0;
                    this.powerUp = false;
                } else {
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += 0.1;
                }
            }
         }
        draw(context) {
            if (this.game.debugMode) {
                context.fillStyle = 'black';
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.save();
                context.globalAlpha = 0.2;
                context.fillRect(this.x, this.y, this.width, this.height);
                context.beginPath();
                context.arc(this.x + this.width * 0.5, this.y + this.height * 0.5, this.radius, 0, Math.PI * 2);
                context.closePath();
                context.restore();
                context.stroke();
            }
            context.fillStyle = 'white';
            context.font = '25px Orbitron'
            context.fillText(this.health, this.x + this.width * 0.3, this.y + this.height * 0.5);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
                
            });
            context.drawImage(this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height);
        }
        shootTop() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x+this.width*0.5, this.y+this.height*0.18 ));
                this.game.ammo--;
                //console.log(this.projectiles);
            }
            if (this.powerUp) { this.shootBottom();}
            
        }
        shootBottom() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + this.width * 0.5, this.y + this.height * 0.95));
            }
        }
        enterPowerUp() {
            this.powerUp = true;
            this.powerUpTimer = 0;
            if (this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
        }
        consolelog() {
            console.log(this);
        }
    }
    class Enemy{
        constructor(game) {
            this.game = game;
            this.x= this.game.width;
            this.radius=this.width;
            this.speedX = Math.random()*-1.5-0.5;
            this.speedY = 0;
            this.frameX = 0;
            this.frameY = 0;
            this.markedForDeletion = false;
            

        }
        update() {
            this.x += this.speedX -this.game.speed;
            if (this.frameX < this.maxFrames) this.frameX++;
            else this.frameX = 0;
            if (this.x + this.width < 0) { this.markedForDeletion = true; }

            
        }
        draw(context) {
            if (this.game.debugMode) {
                context.fillStyle = 'red';
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.save();
                context.globalAlpha = 0.2;
                context.fillRect(this.x, this.y, this.width, this.height);
                context.restore();
                context.beginPath();
                context.arc(this.x + this.width * 0.5, this.y + this.height * 0.5, this.radius * 0.8, 0, Math.PI * 2);
                context.closePath();
                context.stroke();
            }
            
            context.fillStyle = 'black';
            context.font = '25px Orbitron'
            context.fillText(this.health, this.x + this.width * 0.4, this.y + this.height * 0.6);
            context.drawImage(this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height);
        }
    }
    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.image = document.getElementById('angler1');
            this.width = 228;
            this.height = 169;
            this.radius = this.width;
            this.y = Math.random() * this.game.height * 0.95 - this.height;
            this.health = 2;
            this.score = this.health;
            this.maxFrames = 37;
            
            this.frameY = Math.floor(Math.random() * 3);
            }
    }
    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.image = document.getElementById('angler2');
            this.width = 213;
            this.height = 165;
            this.radius = this.width;
            this.y = Math.random() * this.game.height * 0.95 - this.height;
            this.health = 3;
            this.score = this.health;
            this.maxFrames = 37;

            this.frameY = Math.floor(Math.random() * 2);
        }
    }
    class Lucky extends Enemy {
        constructor(game) {
            super(game); 
            this.image = document.getElementById('lucky');
            this.width = 99;
            this.height = 95;
            this.radius = this.width;
            this.y = Math.random() * this.game.height * 0.95 - this.height;
            this.health = 2;
            this.score = 15;
            this.maxFrames = 37;
            this.type = 'lucky'; 

            this.frameY = Math.floor(Math.random() * 2);
        } 
    }
    class Hivewhale extends Enemy {
        constructor(game) {
            super(game);
            
            this.width = 400;
            this.height = 227;
            this.y = Math.random() * this.game.height * 0.95 - this.height;
            this.image = document.getElementById('wahle');
            this.health = 20;
            this.score = this.health;
            this.maxFrames = 37;
            this.type = 'hive';
            this.radius = this.width;
            this.frameY = 0;
            this.speedX = Math.random() *-1.2 -0.2;
        }
    }
    class Drone extends Enemy {
        constructor(game,x,y) {
            super(game);
            this.x = x;
            this.y = y;
            this.width = 115;
            this.height = 95;
            this.image = document.getElementById('drone');
            this.health = 1;
            this.score = this.health*2;
            this.maxFrames = 37;
            this.type = 'drone';
            this.radius = this.width;
            this.frameY = Math.floor(Math.random() * 2);
            this.speedX = Math.random() * -4.0 - 0.5;
        }
    }

    class Layer{
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = this.image.width;
            this.height = this.image.height;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.x <= -this.width) {
                this.x = 0;
            } 
            this.x -= this.game.speed * this.speedModifier;
            
            
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            //context.drawImage(this.image, this.x - this.width, this.y, this.width, this.height);
        }
     }
    class Backround{ 
        constructor(game) {
            this.game = game;
            
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 0.4);
            this.layer2 = new Layer(this.game, this.image2, 0.6);
            this.layer3 = new Layer(this.game, this.image3, 0.8);
            this.layer4 = new Layer(this.game, this.image4, 1);
            this.layers = [this.layer1, this.layer2, this.layer3, this.layer4];
        }
        update() { 
            this.layers.forEach(layer => layer.update());
        }
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }
    class Explosion {
        constructor(game, x, y) {
            this.game = game;
            this.spriteWidth = 200;
            this.spriteHeight = 200;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrames = 8;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width * 0.5;
            this.y = y - this.height * 0.5;
            this.fps = 30;
            this.timer = 0;
            this.timeInterval = 1000 / this.fps;
            this.markedForDeletion = false; 
            
        }
        update(deltaTime) {
            this.x -= this.game.speed;
            if (this.timer > this.timeInterval) {
                this.frameX++;
                this.timer = 0;
            }
            else this.timer += deltaTime;
        }
        draw(context) {
            context.drawImage(this.image,
                this.frameX*this.spriteWidth,
                this.frameY*this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y,
                this.width,
                this.height,
                );
        }
    }
    class FireExplosion extends Explosion{
        constructor(game,x,y) {
            super(game, x, y);
            this.image = document.getElementById('fireExplosion');  
        }
    }
    class SmokeExplosion extends Explosion {
        constructor(game,x,y) {
            super(game, x, y); 
            this.image = document.getElementById('smokeExplosion');
        }
    }
    class Ui{ 
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Orbitron';
            this.color = 'white';
            
        }
        draw(context) {
            context.save();
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'blue';

            context.fillStyle = this.color;
            context.font = this.fontSize + 'px ' + this.fontFamily;
            //score
            context.fillText('Score: '+this.game.score,20,40);
            
            //timer
            const formatedTime =(this.game.gameTime*0.001).toFixed(1);
            context.fillText('Timer: ' + formatedTime,20,95);
            //gameOver messages
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                // condition WIN
                if (this.game.score > this.game.winningScore) {
                    this.game.gameOver = true;
                    message1 = "WELL DONE";
                    message2 = "YOU WIN";
                //condition LOOSE
                } else if (this.game.player.health <= 0|| this.game.timeLimit) {
                    message1 = "YOU LOSE";
                    message2 = "TRY AGAIN!";
                    this.game.gameOver = true;    
                }
                context.font = '50px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5);

                context.font = '40px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, (this.game.height * 0.5)+this.fontSize*1.5);
            }
            //ammo
            if (this.game.player.powerUp) context.fillStyle = 'yellow';
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            context.restore();
            

        }
    }
    class Game{
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.debugMode = false;
            this.backround = new Backround(this);
            this.player = new Player(this);
            if(this.debugMode)console.log(this.player);
            this.input = new InputHandler(this);
            this.ui = new Ui(this);
            this.keys = [];
            this.enemies = [];
            this.particles = [];
            this.explosions = [];
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 350;
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.score = 0;
            this.winningScore = 100;
            this.GameOver = false;
            this.gameTime=0;
            this.timeLimit = 30000;
            this.speed = 1;
            
        
        }
        update(deltaTime) {
            
            if (!this.gameOver) { this.gameTime += deltaTime; }
            if (this.gameTime > this.timeLimit) { this.gameOver = true; }
            this.backround.update();
            this.backround.layer4.update();
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);
            //if (this.debugMode) console.log(this.explosions);
            
            //colliding check
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.collisionRect(this.player, enemy)) {
                    //console.log('enemy colliding');
                    enemy.markedForDeletion = true;
                    this.addExplosion(enemy);
                    for (let i = 0; i < 5; i++) {
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    }
                    if (enemy.type === 'lucky') this.player.enterPowerUp();   
                    else if(!this.gameOver) this.score--;
                    //console.log(this.explosions);
                };
                this.player.projectiles.forEach(projectile => {
                    if (this.collisionRect(projectile, enemy)) {
                        //console.log('enemy colliding');
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                        
                        enemy.health--;
                        projectile.markedForDeletion = true;
                        if (enemy.health <= 0) {
                            for (let i = 0; i < enemy.score; i++) {
                                this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }
                            enemy.markedForDeletion = true;
                            this.addExplosion(enemy);
                            if (enemy.type === 'hive') {
                                for (let i = 0; i < enemy.score; i++){
                                    this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width*0.5, enemy.y + Math.random() * enemy.height*0.5));
                                }
                                
                            }
                        if(!this.gameOver)this.score += enemy.score;
                        //if(this.score > this.winningScore){this.gameOver=true}
                        }
                    };
                })
                
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion); 
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;

            } else {
                this.enemyTimer += deltaTime;
            }
         }
        draw(context) {
            
            this.backround.draw(context);
            this.ui.draw(context);
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.explosions.forEach(explosion => {
                explosion.draw(context);
            });
            this.player.draw(context);
            this.backround.layer4.draw(context);
            
        }
        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.3) this.enemies.push(new Angler1(this));
            else if (randomize < 0.6) this.enemies.push(new Angler2(this));
            else if (randomize < 0.7) this.enemies.push(new Hivewhale(this));
            else this.enemies.push(new Lucky (this));
            //console.log(this.enemies);
        }
        addExplosion(enemy) {
            const randomize = Math.random();
            if (randomize < 0.5) {
                this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
            } else {
                this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
            }
            //console.log(this.explosions);
        }
        collisionRect(first, second) {
            /*if (!(first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)) {
                return true;*/ 
                //second solution
            if ( (first.x < second.x + second.width &&
                first.x + first.width > second.x &&
                first.y < second.y + second.height &&
                first.y + first.height > second.y)) {
                return true;
                //console.log('colisionRect'); 
            }
        }
        collisionCircle(first, second) {
            let dx = first.x - second.x;
            let dy = first.y - second.y;
            let distance = Math.sqrt(dx * dx - dy * dy);
            let sumofRad = first.radius + second.radius;
            if (distance < sumofRad) {
                //colliding
                
                //console.log('Circle colliding');
                return true;
            }
            if (distance == sumofRad) {
                //contact
                //console.log('contact');
            }
            /*
            if (distance < sumofRad) {
                //no colliding
                console.log('no colliding');
            }*/

        }
        targetting() {
            
        }
    }
    const game = new Game(canvas.width, canvas.height);
    


    let lastTime = 0;
    //Animer  et mettre a jour
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        
        requestAnimationFrame(animate);

    }
   
    animate(0);


    
});

   
