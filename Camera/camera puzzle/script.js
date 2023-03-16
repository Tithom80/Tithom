//on initialise les variables utiles
let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;
//let DATA;
let SCALER = 0.6;
let SIZE = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rows: 3,
    columns: 3,
};
let PIECES = [];
let SELECTED_PIECE = null;
let START_TIME = null;
let END_TIME = null;
let POP_SOUND =new Audio('waterdrops2.ogg');
POP_SOUND.volume=0.2;
let AUDIO_CONTEXT = new(AudioContext||webkitAudioContext||window.webkitAudioContext)();
let keys={
    DO:261.6,
    RE:293,
    MI:329.6,
    FA:349.2,
    SOL:392,
    LA:440,
    SI:493.9,
    DO5:523.2
};
function main() {
    CANVAS = document.getElementById("canvas1");
    CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    addEventListeners();

    let promise = navigator.mediaDevices.getUserMedia({ video: true });

    promise.then(function (signal) {
        VIDEO = document.createElement("video");
        VIDEO.srcObject = signal;
        VIDEO.play();
        //DATA=CONTEXT.getImageData(0, 0, CANVAS.width, CANVAS.height);
        VIDEO.onloadeddata = function () {
            handleResize();
            initPieces(3, 3);
            randomizePieces();
            

            //window.addEventListener('resize', handleResize);
            updateGame();
            //console.log(VIDEO.srcObject);


        }
    }).catch(function (err) {
        alert('camera error: ' + err);
    });
}
function setDifficulty() {
    let diff = document.getElementById("difficulty").value;
    switch (diff) {
        case "easy":
            initPieces(3, 3);
            break;
        case "normal":
            initPieces(5, 5);
            break;
        case "hard":
            initPieces(8, 8);
            break;
        case "insane":
            initPieces(10, 10);
            break;
    }
}
function restart() {
    START_TIME = new Date().getTime();
    END_TIME = null;
    randomizePieces();
    document.getElementById("menuItems").style.display= "none";
    //console.log(START_TIME);

}

function updateTime(){
    let now = new Date().getTime();
    if(START_TIME!=null){
        if(END_TIME!=null){
            document.getElementById('time').innerHTML= 
            formatTime(END_TIME-START_TIME);
        }else{
            document.getElementById('time').innerHTML= 
            formatTime(now-START_TIME);
        }
        
    }
}
function isComplete(){
    for(let i =0;i<PIECES.length;i++){
        if(PIECES[i].correct==false){
            return false;
        }
    }
    return true;
}
function formatTime(milliseconds){
let seconds = Math.floor(milliseconds/1000);
let s = Math.floor(seconds%60);
let m= Math.floor((seconds%(60*60))/60);
let h= Math.floor((seconds%(60*60*24))/(60*60));
let formatedTime = h.toString().padStart(2,'0');
formatedTime+=":";
formatedTime+=m.toString().padStart(2,'0');
formatedTime+=":";
formatedTime+=s.toString().padStart(2,'0');
return formatedTime;
}
function addEventListeners() {
    CANVAS.addEventListener('mousedown', onmousedown);
    CANVAS.addEventListener('mousemove', onmousemove);
    CANVAS.addEventListener('mouseup', onmouseup);
    CANVAS.addEventListener('touchstart', ontouchstart);
    CANVAS.addEventListener('touchmove', ontouchmove);
    CANVAS.addEventListener('touchend', ontouchend);
}
function ontouchstart(e) {
    let loc = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    onmousedown(loc);
}
function ontouchmove(e) {
    let loc = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    onmousemove(loc);
}
function ontouchend(e) {

    onmouseup();
}
function onmousedown(e) {
    SELECTED_PIECE = getPressedPiece(e);
    if (SELECTED_PIECE != null) {
        const index = PIECES.indexOf(SELECTED_PIECE);
        if (index > -1) {
            PIECES.splice(index, 1);
            PIECES.push(SELECTED_PIECE);
        }
        SELECTED_PIECE.offset = {
            x: e.x - SELECTED_PIECE.x,
            y: e.y - SELECTED_PIECE.y,
        }
        SELECTED_PIECE.correct=false;
    }
}
function onmousemove(e) {
    if (SELECTED_PIECE != null) {
        SELECTED_PIECE.x = e.x - SELECTED_PIECE.offset.x;
        SELECTED_PIECE.y = e.y - SELECTED_PIECE.offset.y;
    }
}
function onmouseup(e) {
    if (SELECTED_PIECE.isClose()) {
        SELECTED_PIECE.snap();
        if(isComplete() && END_TIME==null){
            let now=new Date().getTime();
            END_TIME=now;
            setTimeout(playMelody,300);
            document.getElementById("menuItems").style.display= "block";
        }
    }
    SELECTED_PIECE = null;
}
function getPressedPiece(loc) {
    for (let i = PIECES.length - 1; i >= 0; i--) {
        if (loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width && loc.y > PIECES[i].y && loc.y < PIECES[i].y + PIECES[i].height) {
            return PIECES[i];
        }
    }
    return null;
}
function handleResize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    let resizer = SCALER * Math.min(
        window.innerWidth / VIDEO.videoWidth,
        window.innerHeight / VIDEO.videoHeight
    );
    SIZE.width = resizer * VIDEO.videoWidth;
    SIZE.height = resizer * VIDEO.videoHeight;
    SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
    SIZE.y = window.innerHeight / 2 - SIZE.height / 2;
    //console.log(SIZE);
}

function updateGame() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CONTEXT.save();
    CONTEXT.globalAlpha = 0.5;
    CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);

    CONTEXT.restore();
    for (let i = 0; i < PIECES.length; i++) {
        PIECES[i].draw(CONTEXT);
        //console.log(PIECES[i].width);
    }
    updateTime();
    window.requestAnimationFrame(updateGame);


}
function initPieces(rows, columns) {
    SIZE.rows = rows;
    SIZE.columns = columns;
    PIECES = [];
    for (let i = 0; i < SIZE.rows; i++) {
        for (let j = 0; j < SIZE.columns; j++) {
            PIECES.push(new Piece(i, j));
            //console.log(PIECES);
        }
    }
}
function randomizePieces() {
    for (let i = 0; i < PIECES.length; i++) {
        let loc = {
            x: Math.random() * CANVAS.width*0.8,
            y: Math.random() * CANVAS.height*0.8,
        };
        PIECES[i].x = loc.x;
        PIECES[i].y = loc.y;
        PIECES[i].correct = false;
    }
}

class Piece {
    constructor(rowIndex, colIndex) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.width = SIZE.width / SIZE.columns;
        this.height = SIZE.height / SIZE.rows;
        this.x = SIZE.x + this.width * this.colIndex;
        this.y = SIZE.y + this.height * this.rowIndex;
        this.xCorrect = this.x;
        this.yCorrect = this.y;
        this.correct= true;

    }
    draw() {
        CONTEXT.fillStyle == 'red';
        CONTEXT.beginPath();
        CONTEXT.drawImage(VIDEO,
            this.colIndex * VIDEO.videoWidth / SIZE.columns,
            this.rowIndex * VIDEO.videoHeight / SIZE.rows,
            VIDEO.videoWidth / SIZE.columns,
            VIDEO.videoHeight / SIZE.rows,
            this.x,
            this.y,
            this.width,
            this.height);
        CONTEXT.rect(this.x, this.y, this.width, this.height);
        CONTEXT.stroke();
    }
    isClose() {
        if (distance({ x: this.x, y: this.y }, { x: this.xCorrect, y: this.yCorrect }) < this.width / 3) {
            return true;
        }
        return false;
    }
    snap() {
        this.x = this.xCorrect;
        this.y = this.yCorrect;
        this.correct =true;
        POP_SOUND.play();
    }
}
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
function playNote(key,duration){
    let osc = AUDIO_CONTEXT.createOscillator();
    osc.frequency.value=key;
    osc.start(AUDIO_CONTEXT.currentTime);
    osc.stop(AUDIO_CONTEXT.currentTime+duration/1000);
    let envelope=AUDIO_CONTEXT.createGain();
    osc.connect(envelope);
    osc.type="triangle";
    envelope.connect(AUDIO_CONTEXT.destination);
    envelope.gain.setValueAtTime(0,AUDIO_CONTEXT.currentTime);
    envelope.gain.linearRampToValueAtTime(0.25,AUDIO_CONTEXT.currentTime+0.1);
    envelope.gain.linearRampToValueAtTime(0,AUDIO_CONTEXT.currentTime+duration/1000);
    setTimeout(function(){
        osc.disconnect();
    },duration);
}
function playMelody(){
    playNote(keys.DO,300);
    setTimeout(function(){
        playNote(keys.RE,300);
    },300);
    setTimeout(function(){
        playNote(keys.MI,300);
    },600);
    setTimeout(function(){
        playNote(keys.DO,300);
    },900);
    
     
}

main();







