import { StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft , RunningRight,JumpingLeft, JumpingRight, FallingLeft,FallingRight} from "./state.js";


export default class Player {
    constructor(gameWidth, gameHeight) {

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        this.image = document.getElementById("playerImage");
        
        this.width = 200;//this.image / 9;
        this.height = 181.83;//
        this.x = 100;
        this.y = this.gameHeight - this.height;
        
        this.vy = 0;
        this.weight = 0.5;

        this.states = [new StandingLeft(this), new StandingRight(this), new SittingLeft(this), new SittingRight(this), new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), new JumpingRight(this),new FallingLeft(this),new FallingRight(this)];
        this.currentState = this.states[1];
        this.maxFrame = 4;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps
    }
    

    draw(context, deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        //context.strokeStyle = "white";
        //context.strokeRect(this.x +5, this.y +15, this.width-10, this.height-10);
        //context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width/2, 0, Math.PI * 2);
        //context.stroke();
        context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);

    }
    update(input) {
        this.currentState.handleInput(input);
        
        
        //horizontal boundaries
        this.x += this.speed;
        if (this.x <= 0) { this.x = 0; }
        else if (this.x > this.gameWidth -this.width) { this.x = this.gameWidth - this.width; }
        //vertical
        this.y += this.vy;
        if (!this.onGround()) {
            this.vy += this.weight;
        } else {
            this.vy = 0;

        }
        if (this.y > this.gameHeight - this.height) { this.y = this.gameHeight - this.height; }
    
    }
    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    onGround() {
        return this.y >= this.gameHeight - this.height;
    }


}