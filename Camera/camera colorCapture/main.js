//global variables
let VIDEO=null;
const SIZE =128;
let CANVAS; 
let RGBA_CANVAS; 
let zOffset = [-50,-50];
let FRAME =0;
let COLOR_KEY=[0,200,0,255];
let THRESHOLD= 30;
let INTERVAL =100;

let EFFECT_INDEX=0;
let EFFECTS=[
    "normal",
    "grayScale",
    "grayScaleInvert",
    "invertColor",
    "symetry",
    "Ghost",
    "mirror",
    "fullmirror",
    "Double",
    "symetryDiagonal",
    "stack"

];
function main(){
    removeOverlay();
    CANVAS=initializeCanvas("myCanvas",SIZE,SIZE);
    initializeCamera();
    ctx= CANVAS.getContext('2d');
    RGBA_CANVAS=initializeCanvas("myColorCanvas",SIZE*10,SIZE*10);
    colorCtx = RGBA_CANVAS.getContext('2d');
    
    addEventListeners(CANVAS);

    setInterval(function(){
        drawScene(ctx, colorCtx);
        
    },INTERVAL);//intervall /100ms
}

function addEventListeners(canvas){
    canvas.addEventListener("mousedown", onMouseDown
    );
}
function onMouseDown(event){
    let loc = getMouseLocation(event);
    let ctx = event.target.getContext('2d');
    COLOR_KEY=getColorAtLocation(ctx,loc);
    //console.log(COLOR_KEY);
}
function getMouseLocation(event){
    let rect = event.target.getBoundingClientRect();
    return [
        SIZE*(event.clientX-rect.left)/(rect.right-rect.left),
        SIZE*(event.clientY-rect.top)/(rect.bottom-rect.top)
    ];
}
function getColorAtLocation(ctx,location){
    let data = ctx.getImageData(location[0],location[1],1,1).data;
    return data;
}
function initializeCanvas(canvasName,width,height){
    let canvas = document.getElementById(canvasName);
    canvas.width=width;
    canvas.height=height;
    return canvas;

}
function drawScene(ctx,colorCtx){
    if(VIDEO !=null){
        // keep the middle part of video to put on canvas
        let min = Math.min(VIDEO.videoWidth,VIDEO.videoHeight);
        let sx =(VIDEO.videoWidth-min)*0.5;
        let sy =(VIDEO.videoHeight-min)*0.5;
        ctx.drawImage(VIDEO,sx,sy,min,min,0,0,SIZE,SIZE/*,CANVAS.width,CANVAS.height*/);
    }else{
        ctx.fillText("LOADING",CANVAS.width*0.5,CANVAS.height*0.5);
    }
    //let finder =new EffectColorFinder(CANVAS,CANVAS,COLOR_KEY);
    //finder.update();
    //applySomeEffect(ctx);

    //get informations from canvas
    let colors = getColorsFrom(ctx,false);
    
    drawColorSpace(colors,colorCtx);
    //console.log(colors);

    let locs =getLocationOfPixelsWithColor(ctx,COLOR_KEY);
    markPixelLocations(ctx,locs);

    //FRAME++;
}
function markPixelLocations(ctx,locations){
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);//on scan le canvas
    for(let i=0;i<locations.length;i++){
        let x = locations[i][0];
        let y = locations[i][1];
        imgData.data[(y*SIZE+x)*4+0]=255;
        imgData.data[(y*SIZE+x)*4+1]=0;
        imgData.data[(y*SIZE+x)*4+2]=0;
        imgData.data[(y*SIZE+x)*4+3]=255;
    }
    //console.log(locations);
    //console.log(imgData.data);
    //ctx.putImageData(imgData,0,0);
}
function getLocationOfPixelsWithColor(ctx,COLOR_KEY){
    const locations=[];
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);//on scan le canvas

    for(let y=0;y<imgData.height;y++){
        for(let x=0;x<imgData.width;x++){
            let px = getPixelValue(imgData.data,x,y);
            if(euclDistance(px,COLOR_KEY)<THRESHOLD){
                locations.push([x,y]);
            }
            //console.log(locations);
            //console.log(imgData.data);
        }
    }
    //console.log(locations);
    return locations;

}
function drawColorSpace(colors,ctx){

    //Axes
    
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    ctx.save();
    //aligning the scatterplot(graphique)
    ctx.scale(0.7,0.7);
    ctx.translate(ctx.canvas.width*0.35,ctx.canvas.height*0.05);
    ctx.scale(ctx.canvas.width/255,-ctx.canvas.height/255);
    ctx.translate(0,-255);
    //vertical axe
    ctx.lineWidh =5;
    ctx.strokeStyle = 'rgba(0,255,0,255)';
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,255);
    ctx.stroke();
    //horizontal axe
    ctx.strokeStyle = 'rgba(255,0,0,255)';
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(255,0);
    ctx.stroke();
    //axe z(dimention 3)
    ctx.strokeStyle = 'rgba(0,0,255,255)';
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(zOffset[0],zOffset[1]);
    ctx.stroke();

    zOffset[0] += Math.sin(FRAME/10)*10;
    //zOffset[1] += Math.sin(FRAME/10)*10;

    //data points
    //trier les points
colors.sort(function(a,b){
    return a[2]-b[2];
});
//drawing colors
    for(let i=0;i<colors.length;i++){
        
        let xySize = getXYSize(colors[i]);
        ctx.fillStyle='rgba('+colors[i][0]+','+colors[i][1]+','+colors[i][2]+',0.5)';
        if(euclDistance(colors[i],COLOR_KEY)<THRESHOLD){
            ctx.fillStyle = 'red'
        }
        ctx.beginPath();
        //ctx.arc(x,y,3,0,Math.PI*2);
        ctx.rect(
            xySize.x-xySize.size/2,
            xySize.y-xySize.size/2,
            xySize.size,
            xySize.size
            );
        ctx.fill();
        //ctx.stroke();
    }
    let xySize= getXYSize(COLOR_KEY);
    xySize.size *=5;
    ctx.strokeStyle = 'rgba('+COLOR_KEY[0]+','+COLOR_KEY[1]+','+COLOR_KEY[2]+','+COLOR_KEY[3]+')';
    ctx.beginPath();
    ctx.rect(
        xySize.x-xySize.size/2,
        xySize.y-xySize.size/2,
        xySize.size,
        xySize.size
        );
    ctx.stroke();
    

    ctx.restore();
}
function getXYSize(color){
    let x=color[0];//red
    let y=color[1];//green
    //normalize green betwin 0 and 1
    x+=zOffset[0]*(color[2]/255);
    y+=zOffset[1]*(color[2]/255);
    
    let size = 1+(color[2]/255);
    return {
        x:x,
        y:y,
        size:size
    }
}
function euclDistance(A,B){
    let distance = 0;
    for(let i =0;i<A.length;i++){
        distance+=(A[i]-B[i])*(A[i]-B[i]);
    }
    return Math.sqrt(distance);
}

function getColorsFrom(ctx){
    const colors=[];
    let imgData = ctx.getImageData(0,0,CANVAS.width,CANVAS.height);//on scan le canvas
    for(let y=0;y<imgData.height;y++){
        for(let x=0;x<imgData.width;x++){
            let px = getPixelValue(imgData.data,x,y);
            colors.push([px.red,px.green,px.blue,px.alpha]);

            //console.log(colors[0]);
            //console.log(imgData.data);
        }
    }
    return colors;
}

//initialisation des donnees
function getPixelValue(data,x,y){
    return {
        red:    data[(y*SIZE+x)*4+0],//first element in the data Array
        green:  data[(y*SIZE+x)*4+1],
        blue:   data[(y*SIZE+x)*4+2],
        alpha:  data[(y*SIZE+x)*4+3]//last element int the data Array
    };

}

function initializeCamera(){
    const promise=navigator.mediaDevices.getUserMedia({video:true});
    promise.then(function(signal){
    //using the signal
    VIDEO = document.createElement('video');
    VIDEO.srcObject=signal;
    VIDEO.play();
    }).catch(function(err){
        alert("Camera Error "+err);
    });
}

function removeOverlay(){
    let element = document.getElementById('overlay');
    element.style.display='none';
}