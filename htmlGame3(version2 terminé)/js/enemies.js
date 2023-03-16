class Enemy{
    constructor(game) {
        this.game = game;
        this.framex = 0;//animation reader
        this.framey = 0;//animation selector
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.readyToDel = false;

    }
    update(deltaTime) {
        //movements
        this.x -= this.speedx + this.game.speed;
        this.y += this.speedy;
        
        //onsole.log('frameTimer'+this.frameTimer);
        //console.log('interval'+this.frameInterval);
        //iteration of images of animation
        if (this.frameTimer >= this.frameInterval) {
            //console.log('timer');
            this.framex++;
            this.frameTimer = 0;
            if (this.framex > this.maxFrame) {
                this.framex = 0;
            }
        }
        
        this.frameTimer += deltaTime;
            
        
//si on depasse le cadre on est marué pour la supression
        if (this.x + this.width < 0) {
            this.readyToDel = true;
        }

    }
    draw(context) {
        
            context.drawImage(this.image, this.framex * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);

    }


}
export class FlyingEnemy extends Enemy{
    constructor(game) {
        super();
        this.game = game;
        this.width = 60;//longueur du sprite
        this.height = 44;//largeur du sprite 
        this.x = this.game.width + this.width + Math.random();//position X du coin en haut à gauche du joueur
        this.y = Math.random()*this.game.height*0.5;//position Y du coin en haut à gauche du Enemy
        this.speedx = Math.random()+1;//vitesse de deplacement en x
        this.speedy = 0;//vitesse de deplacementen y
        this.maxFrame = 5;//combien d'images dans une animation
        this.image = document.getElementById('enemyImage1');
        this.angle = 0;
        this.radius = this.width / 2.5;
        this.va = Math.random()*0.1+0.1;
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
        
        
    }
    draw(context) {
        super.draw(context);
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.5, 0, Math.PI * 2);
            context.stroke();
        }


    }
    
}

export class GroundEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 60;//longueur du sprite
        this.height = 87;//largeur du sprite 
        this.x = this.game.width + this.width + Math.random();//position X du coin en haut à gauche du joueur
        this.y = this.game.height -this.height-this.game.groundMargin;//position Y du coin en haut à gauche du Enemy
        this.speedx = 0 ;//vitesse de deplacement en x
        this.speedy = 0;//vitesse de deplacementen y
        this.maxFrame = 1;//combien d'images dans une animation
        this.image = document.getElementById('enemyImage2');
        this.radius = this.width / 2;


    }
    update(deltaTime) {
        super.update(deltaTime);
    }
    draw(context) {
        super.draw(context);
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width / 2, (this.y + this.height / 2)-15, this.width / 2, 0, Math.PI * 2);
            context.stroke();
        }


    }

 }
export class ClambingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 120;//longueur du sprite
        this.height = 144;//largeur du sprite 
        this.x = this.game.width ;//position X du coin en haut à gauche du joueur
        this.y = Math.random()*this.game.height*0.5;//position Y du coin en haut à gauche du Enemy
        this.speedx = 0;//vitesse de deplacement en x
        this.speedy = Math.random() > 0.5 ? 1 : -1;//vitesse de deplacementen y//ternary operator: equiv if >0.5 = 1 else = -1
        this.maxFrame = 5;//combien d'images dans une animation
        this.image = document.getElementById('enemyImage3');
        this.radius = this.width / 2;


    }
    update(deltaTime) {
        super.update(deltaTime);
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedy *= -1;
        if (this.y < -this.height)this.readyToDel = true;
    }
    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width/2 , 0, Math.PI * 2);
            context.stroke();
        }
        super.draw(context);
        //web
        context.beginPath();
        context.moveTo(this.x + this.width/2 , 0);
        context.lineTo(this.x + this.width / 2, this.y+50);
        context.stroke();


    }

 }
