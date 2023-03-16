import { Dust, Fire, Splash } from './particle.js';

const states = {
    
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT:6,
    STANDING: 7,

}
/*playerAnimState = [
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
];*/

class State {
    constructor(state, game){
        this.state = state;
        this.game = game;

    }
}

export class Sitting extends State{
    constructor(game) {
        super('SITTING',game);
        
    }
    enter() { 
        this.game.player.maxFrames = 5;
        this.game.player.framex = 0;
        this.game.player.framey = 5;
    }
    handleInput(input) {
        if (input.includes('ArrowLeft')||input.includes('ArrowRight')) {
            this.game.player.setState(states.RUNNING,1);
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}
export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
        
    }
    enter() {
        this.game.player.maxFrames = 9;
        this.game.player.framex = 0;
        this.game.player.framey = 3;
    }
    handleInput(input) {
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5-25, this.game.player.y + this.game.player.height * 0.5+40));
        if (input.includes('ArrowDown')) {
            this.game.player.setState(states.SITTING, 0);
            this.game.player.playerAnimState = 'sit';
        } else if (input.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1);
            this.game.player.playerAnimState = 'jump';
            
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
            this.game.player.playerAnimState = 'roll';
        }
    }
}
export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
       
    }
    enter() {
        this.game.player.maxFrames = 7;
        this.game.player.framex = 0;
        if (this.game.player.onGround()) this.game.player.vy -= 30;
        this.game.player.framey = 1;
    }
    handleInput(input) {
        if (this.game.player.vy > this.game.player.weight) { 
            if (!input.includes('ArrowDown')) {
                this.game.player.setState(states.FALLING, 1);
                this.game.player.playerAnimState = 'fall';
            }
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
            this.game.player.playerAnimState = 'roll';
        } else if (input.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0);
            this.game.player.playerAnimState = 'roll';
        }
    }
}
export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
        
    }
    enter() {
        this.game.player.maxFrames = 7;
        this.game.player.framex = 0;
        this.game.player.framey = 2;
    }
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            this.game.player.playerAnimState = 'run';
        } else if (input.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0);
            this.game.player.playerAnimState = 'roll';
        }
    }
}
export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
        
    }
    enter() {
        this.game.player.maxFrames = 6;
        this.game.player.framex = 0;
        this.game.player.framey = 6;
    }
    handleInput(input) {
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5 - 25, this.game.player.y + this.game.player.height * 0.5 + 40));
        if (!input.includes('Enter')&& this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            this.game.player.playerAnimState = 'run';
        }else if (!input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
            this.game.player.playerAnimState = 'fall';
        } else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()) {
            this.game.player.vy -= 32;
            this.game.player.playerAnimState = 'roll';
        }
    }
}
export class Diving extends State {
    constructor(game) {
        super('DIVING', game);
        
    }
    enter() {
        this.game.player.maxFrames = 6;
        this.game.player.framex = 0;
        this.game.player.framey = 6;
        this.game.player.vy += 15;
    }
    handleInput(input) {
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5 - 25, this.game.player.y + this.game.player.height * 0.5 + 40));
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            this.game.player.playerAnimState = 'run';
            for (let i = 0; i < 30; i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.x , this.game.player.y +this.game.player.height-20));
            }
            
        } else if (!input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.ROLLING, 2);
            this.game.player.playerAnimState = 'roll';
        }
    }
}
export class Hit extends State {
    constructor(game) {
        super('HIT', game);

    }
    enter() {
        this.game.player.maxFrames = 10;
        this.game.player.framex = 0;
        this.game.player.framey = 4;
        
    }
    handleInput(input) {
        if (this.game.player.framex>=10 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            this.game.player.playerAnimState = 'run';
   
        } else if (this.game.player.framex >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
            this.game.player.playerAnimState = 'fall';
        }
    }
}
export class Standing extends State {
    constructor(game) {
        super('STANDING', game);
        
    }
    enter() {
        this.game.player.maxFrames = 7;
        this.game.player.framex = 0;
        this.game.player.framey = 0;
    }
    handleInput(input) {
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
            this.game.player.setState(states.RUNNING, 1);
            this.game.player.playerAnimState = 'run';
        } else if (input.includes('ArrowDown')) {
            this.game.player.setState(states.SITTING, 0);
            this.game.player.playerAnimState = 'sit';
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2);
            this.game.player.playerAnimState = 'roll';
        } else {
            this.game.player.setState(states.STANDING, 0);
            this.game.player.playerAnimState = 'idle';
        }
    }
}