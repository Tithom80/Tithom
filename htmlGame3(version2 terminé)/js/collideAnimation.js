export class CollisionAnim{
    constructor(game, x, y) {
        this.game = game;
        
        this.image = document.getElementById('boomImage');
        this.spriteWidth = this.image.width / 5;
        this.spriteHeight = this.image.height;
        this.sizeModifier = Math.random()+ 0.25;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.framex = 0;
        this.maxFrame = 4;
        this.markedForDeletion = false;
        this.fps = 16;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }
    update(deltaTime) {
        this.x -= this.game.speed;
        this.frameTimer += deltaTime;
        
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            this.framex++;
            if (this.framex >= this.maxFrame) {
                this.markedForDeletion = true;
                this.framex = 0;

            } else {
                this.framex++;

            }
            
        }
        
        

    }
    draw(context) {
        context.save();
        context.drawImage(this.image, this.framex *this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,this.x,this.y,this.width,this.height);
        context.restore();
    }
}