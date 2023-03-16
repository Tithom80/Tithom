export default class InputHandler {
    constructor() {
        this.lastKey = "";
        this.keys = [];
        this.touchY = '';
        this.touchX = '';
        this.touchTreshold = 30;
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = "PRESS left";
                    this.keys.push('PRESS left');
                    break;
                case 'ArrowRight':
                    this.lastKey = "PRESS right";
                    this.keys.push('PRESS right');
                    break;
                case 'ArrowDown':
                    this.lastKey = "PRESS down";
                    this.keys.push('PRESS down');
                    break;
                case 'ArrowUp':
                    this.lastKey = "PRESS up";
                    this.keys.push('PRESS up');
                    break;
                case 'KeyD':
                    this.lastKey = "PRESS d";
                    this.keys.push('PRESS d');
                    break;
            }
            //console.log(e);
        });
        window.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = "RELEASE left";
                    this.keys.splice(this.keys.indexOf('RELEASE left'), 1);
                    break;
                case 'ArrowRight':
                    this.lastKey = "RELEASE right";
                    this.keys.splice(this.keys.indexOf('RELEASE right'), 1);
                    break;
                case 'ArrowDown':
                    this.lastKey = "RELEASE down";
                    this.keys.splice(this.keys.indexOf('RELEASE down'), 1);
                    break;
                case 'ArrowUp':
                    this.lastKey = "RELEASE up";
                    this.keys.splice(this.keys.indexOf('RELEASE up'), 1);
                    break;
                    case 'KeyD':
                    this.lastKey = "PRESS d";
                    this.keys.splice(this.keys.indexOf('RELEASE d'), 1);
                    break;
            }
        });
                //Mobile handler part

        window.addEventListener('touchstart', (e) => {

        //console.log("user touch screen");
        //console.log(e);
        //console.log(e.changedTouches[0].pageY);
        //console.log(e.changedTouches[0].pageX);
            this.touchY = e.changedTouches[0].pageY;
            this.touchY = e.changedTouches[0].pageX;

        });
        window.addEventListener('touchmove', (e) => {
            //console.log("user move on screen");
            //console.log(e);
            //console.log(e.changedTouches[0].pageY);
            //console.log(e.changedTouches[0].pageX);
            const swipeDistance = e.changedTouches[0].pageY - this.touchY;
            if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) {
                this.keys.push('swipe up');

            } else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                this.keys.push('swipe down');
            }
        });
        window.addEventListener('touchend', (e) => {
            //console.log("user end touch screen");
            //console.log(e);
            //console.log(e.changedTouches[0].pageY);
            //console.log(e.changedTouches[0].pageX);
            //console.log(this.keys);
            this.keys.splice(this.keys.indexOf('swipe up'), 1);
            this.keys.splice(this.keys.indexOf('swipe down'), 1);

        });

    }

}