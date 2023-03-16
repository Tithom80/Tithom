export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        //this.touchY = '';
        //this.touchX = '';
        //this.touchTreshold = 30;
        window.addEventListener('keydown', e => {
            if ((e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight' ||
                e.code === 'Space' ||
                e.code === 'AltLeft'||
                e.code === 'Enter')
                && this.keys.indexOf(e.code) === -1) {
                this.keys.push(e.code);

            } else if (e.key === 'd') {
                this.game.debug = !this.game.debug;

            }
            //console.log(e.key, this.keys);
            //console.log(e);
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight'||
                e.code === 'Space' ||
                e.code === 'AltLeft' ||
                e.code === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.code), 1);

            }
            //console.log(e.key, this.keys);
        });
        //Mobile handler part

        //window.addEventListener('touchstart', e => {
            /*console.log("user touch screen");
            console.log(e);
            console.log(e.changedTouches[0].pageY);
            console.log(e.changedTouches[0].pageX);*/
        /*    this.touchY = e.changedTouches[0].pageY;
            this.touchY = e.changedTouches[0].pageX;

        });
        window.addEventListener('touchmove', e => {
            /*console.log("user move on screen");
            console.log(e);
            console.log(e.changedTouches[0].pageY);
            console.log(e.changedTouches[0].pageX);
            const swipeDistance = e.changedTouches[0].pageY - this.touchY;
            if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) {
                this.keys.push('swipe up');

            } else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                this.keys.push('swipe down');
                if (gameOver) {
                    restartGame();
                }
            }
        });
        window.addEventListener('touchend', e => {
            /*console.log("user end touch screen");
            console.log(e);
            console.log(e.changedTouches[0].pageY);
            console.log(e.changedTouches[0].pageX);
            console.log(this.keys);
            this.keys.splice(this.keys.indexOf('swipe up'), 1);
            this.keys.splice(this.keys.indexOf('swipe down'), 1);

        });
        function restartGame() {
            player.restart();
            background.restart();
            enemies = [];
            score = 0;
            gameOver = false;
            animate(0);

        }*/
        


    }

}