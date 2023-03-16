import { Sitting, Running, Jumping, Falling, Standing, Rolling, Diving, Hit } from "./playerState.js";
import { CollisionAnim } from "./collideAnimation.js";

export class Player{
    constructor(game) {
        this.game = game;
        this.image = document.getElementById("playerImage");
        this.width = this.image.width / 12;//100;//largeur du sprite du joueur
        this.height = 91.3;//hauteur du sprite du joueurthis.image.height / 10;//
        this.x = 100;//position X du coin en haut à gauche du joueur
        this.y = this.game.height - this.game.groundMargin - this.height ;//position Y du coin en haut à gauche du joueur
        this.radius = this.width / 2.5;
        this.speed = 0;
        this.speedy = 0;
        this.walkspeed = 5;
        this.maxspeed = 10;
        this.vy = 0;
        this.vyMax = 1;
        this.weight = 1.5;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game), new Standing(this.game)]; 
        this.playerAnimState = 'idle';
        this.framex = 0;//animation reader
        this.framey = 0;//animation selector
        this.maxFrames = 5;
        this.fps = 35;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.gameFrame = 0;
        this.staggerFrame = 3;
        this.spriteAnimation = [];
        this.animationState = [
            {
                name: 'idle',
                frames: 7,
            },
            {
                name: 'jump',
                frames: 7,
            },
            {
                name: 'fall',
                frames: 7,
            },
            {
                name: 'run',
                frames: 9,
            },
            {
                name: 'dizzy',
                frames: 11,
            },
            {
                name: 'sit',
                frames: 5,
            },
            {
                name: 'roll',
                frames: 7,
            },
            {
                name: 'bite',
                frames: 7,
            },
            {
                name: 'ko',
                frames: 12,
            },
            {
                name: 'getHit',
                frames: 4,
            }
        ];
        //datastructure of Animstates
        this.animationState.forEach((state, index) => {
            let frames = {
                loc: [],
            }
            for (let j = 0; j < state.frames; j++) {
                let positionX = j * this.width;
                let positionY = index * this.height;
                frames.loc.push({ x: positionX, y: positionY });
            }
            this.spriteAnimation[state.name] = frames;
        });
        //console.log(this.animationState);
        
    }
    update(input, deltaTime) {
        //get controller
        this.currentState.handleInput(input);
        //check collision
        this.checkCollisionCircle()
        //this.checkCollisionRect()
        //horizontal movements
        this.x += this.speed;
        if (input.includes("ArrowRight")) {
            this.speed = this.walkspeed;
            if (!input.includes("Enter")) {
                this.playerAnimState = 'run';
            }
        }else if (input.includes("ArrowLeft")) {
            this.speed = -this.walkspeed;
            if (!input.includes("Enter")) {
                this.playerAnimState = 'run';
            }
        }  else {
            this.speed = 0;

            if (this.vy == 0 && this.game.speed <=0) {
                this.playerAnimState = 'idle';
            }
            if (input.includes("ArrowDown")) {
                if (!input.includes("Enter")) {
                    this.playerAnimState = 'sit';
                }
            }
        }
        if (input.includes("Enter")) {
            this.playerAnimState = 'roll';
        }
        //limitation dans le cadre horizontal bounderies
        if (this.x < 0) { this.x = 0; }
        if (this.x > this.game.width - this.width) { this.x = this.game.width - this.width; }

        
       
        

//vertical movements
        this.y += this.vy*this.vyMax;
        if (!this.onGround()) {
            this.vy += this.weight;
            //console.log(this.vy);
            if (this.vy > 0) {
                if (!input.includes("Enter")){
                    this.playerAnimState = 'fall';
                }
            } else if (this.onGround) {
                if (!input.includes("Enter")){
                    this.playerAnimState = 'idle';
                }
            }
            if (this.vy > 0) {
                if (!input.includes("Enter")){
                    this.playerAnimState = 'jump';
                }
            }
            
        }else {
            this.vy = 0;

        }
        /*// vertical movements 2d rpg 4 axes
if (input.includes("ArrowDown")) {
    this.speedy = this.walkspeed;
}else if (input.includes("ArrowUp")) {
    this.speedy = -this.walkspeed;
} else {
    this.speedy = 0;
}*/
        //vertical bounderies
        if (this.y > this.game.height - this.height - this.game.groundMargin) { this.y = this.game.height - this.height - this.game.groundMargin; }
        if (this.y < 0 ) { this.y = 0; }


        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.framex < this.maxFrames) {
                this.framex++;
            } else {
                this.framex = 0;
            }
        } else {
            this.frameTimer += deltaTime;
        }

        
        
     }
    draw(context) { 
        //on dessine le joueur
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.5, 0, Math.PI * 2);
            context.stroke();
        }
        //animer évolué
        let position = Math.floor(this.gameFrame / this.staggerFrame) % this.spriteAnimation[this.playerAnimState].loc.length;
        
        this.framex = this.width * position;
        this.framey = this.spriteAnimation[this.playerAnimState].loc[position].y;
        //context.drawImage(this.image, origine x , origine y , longueure de frame,hauteur de frame, this.x, this.y,this.height,this.width);
        context.drawImage(this.image, this.framex, this.framey, this.width, this.height, this.x, this.y, this.width, this.height);
        this.gameFrame++;   
    }
    onGround() {
        return this.y >= this.game.height - this.height -this.game.groundMargin;
        
    }  
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed *speed;
        this.currentState.enter();
    }
    checkCollisionRect() {
        this.game.enemies.forEach(enemy => {
            if (this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            ) {
                console.log('rect collision');
                enemy.readyToDel = true;
                this.game.score++;
                
            }

        });
    }
    checkCollisionCircle() {
        this.game.enemies.forEach(enemy => {
            let dx = this.x - enemy.x;
            let dy = this.y - enemy.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            const sumOfRadius = enemy.radius + this.radius;
            if (distance < sumOfRadius) {
                enemy.readyToDel = true;
                this.game.collisions.push(new CollisionAnim(this.game,enemy.x + enemy.width*0.5,enemy.y + enemy.height*0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                } else {
                    this.setState(6,0);
                }

                if (this.game.debug){
                    //console.log('circle colliding');
                    
                }
            }
         });
    }
       
}