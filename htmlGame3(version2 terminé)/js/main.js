import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClambingEnemy } from "./enemies.js";
import { Ui } from "./Ui.js";

window.addEventListener('load', function () {
    //on récupère le canvas sur le document html
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 500;
    
    

    class Game {
        constructor(width, height) { 
            this.width = width;
            this.height = height;
            this.speed = 0;
            this.maxSpeed = 6;
            this.groundMargin = 80;
            this.player = new Player(this);
            this.background = new Background(this);
            this.input = new InputHandler(this);
            this.ui = new Ui(this);
            this.collisions = [];
            this.particles = [];
            this.maxParticles = 40;
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = Math.random() + 2000;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'white';
            this.fontColor2 = 'black';
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

    //let gameOver = false;

            
        }
        
        update(deltaTime) { 
            this.background.update(this);
            this.player.update(this.input.keys, deltaTime);
           //enemies handler
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                
                
                if (enemy.readyToDel) {
                    this.enemies.splice(this.enemies.indexOf(enemy), 1)
                }
            });
            //particles handler
            this.particles.forEach((particle,index) => {
                particle.update();
                if (particle.markedForDeletion) {
                    this.particles.splice(index, 1);
                }
            });
            if (this.particles.length > this.maxParticles) {
                this.particle = this.particles.slice(0,this.maxParticles);
            }
            //collision sprites handler
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) {
                    this.collisions.splice(index, 1);
                    console.log(this.collisions);
                }
                
            });

            
        }
        draw(context) { 
            this.background.draw(context);
            this.player.draw(context);

            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            
            this.particles.forEach((particle, index) => {
                particle.draw(context);
            });
            this.collisions.forEach((collision, index) => {
                collision.draw(context);
            });
            this.ui.draw(context);
            
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            } else if (this.speed > 0) {
                this.enemies.push(new ClambingEnemy(this));
            }
            this.enemies.push(new FlyingEnemy(this));
            //console.log('enemy added');
            //console.log(this.enemies[0]);
            //console.log(this.enemies);

        }
        
    }
    const game = new Game(canvas.width, canvas.height);
   //console.log(game);
    let lastTime = 0;
    //Animer, dessiner et mettre a jour le jeu
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        //console.log(deltaTime);
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.background.draw(ctx);
        //background.update(this);
        
        game.player.draw(ctx);
        game.draw(ctx);
        game.update(deltaTime);
        //player.update(input, deltaTime, enemies);
        //handelEnemies(deltaTime);
        //displayStatusText(ctx);

        //if (!gameOver) {
         //   console.log("Running");
         //   
        //}
        requestAnimationFrame(animate);
    }
    animate(0);
});