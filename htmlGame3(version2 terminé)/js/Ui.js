export class Ui{
    constructor(game) {
        this.game = game;
        this.fontSize = 500;
        this.fontFamily = "Helvetica";
    }
    draw(context) {
        context.save();
        context.font = this.fontSize + 'px' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //Score
        context.fillText('Score :'+ this.game.score,20,30);
        context.fillStyle = this.game.fontColor2;
        context.fillText('Score :' + this.game.score, 22, 32);
        context.restore();
    }   
}