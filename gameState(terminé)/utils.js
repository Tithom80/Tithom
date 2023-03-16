export function drawStatusText(context, input, player) {
    
    context.font = '20px Helvetica';
    context.fillText('Last input: ' + input.lastKey, 20, 50);
    context.fillText('Active input: ' + player.currentState.state, 20, 75);
    context.fillText('Active animation: ' + player.frameY, 20, 100);
    context.font = '15px Helvetica';
    context.fillText('speed: ' + player.speed, 20, 125);
    context.fillText('Xposition: ' + player.x, 20, 140);
    context.fillText('Yposition: ' + player.y, 20, 155);
    context.fillText('vy: ' + player.vy, 20, 170);
    context.fillText('Weight: ' + player.weight, 20, 185);
    context.fillText('onGround: ' + player.onGround(), 20, 200);
    context.fillText('maxFrame: ' + player.maxFrame, 20, 215);
    context.fillText('frameX: ' + player.frameX, 20, 230);
    context.fillText('frameTimer: ' + Math.floor(player.frameTimer), 20, 245);


}