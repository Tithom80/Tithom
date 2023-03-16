//global variables
let VIDEO=null;
const SIZE =500;
let CANVAS; 
let CANVAS2;
let COLOR_CANVAS; 
let BUTTONS=[];
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
    CANVAS=initializeCanvas("videoCanvas",SIZE,SIZE);
    initializeCamera();
    ctx= CANVAS.getContext('2d');
    //COLOR_CANVAS=initializeCanvas("myColorCanvas",SIZE,SIZE);
    //colorCtx = COLOR_CANVAS.getContext('2d');

    

    CANVAS.addEventListener("mousedown",onMouseDown);
    CANVAS.addEventListener("mousemove",onMouseMove);
    setInterval(function(){
        drawScene(ctx);
    },100);//intervall /100ms
}

function onMouseDown(event){
    let location = getMouseLocation(event);
    let color = getColor(ctx,location);
    console.log(color);

}

function onMouseMove(){
    let location = getMouseLocation(event);
    let color = getColor(ctx,location);
    for(let i =0;i<BUTTONS.length;i++){
        if (BUTTONS[i].color == color){
            console.log("yes");
        }
        console.log("no");
    }
}

function getColor(ctx2,location){
    let data=ctx2.getImageData(location[0],location[1],1,1);
    return data;
}
function getMouseLocation(event){
    let rect = event.target.getBoundingClientRect();
        let loc = [
            Math.floor(SIZE*(event.clientX-rect.left)/(rect.right-rect.left)),
            Math.floor(SIZE*(event.clientY-rect.top)/(rect.bottom-rect.top))
        ];
        //console.log(loc);
        return loc;
}

function initializeCanvas(canvasName,width,height){
    let canvas = document.getElementById(canvasName);
    canvas.width=width;
    canvas.height=height;
    return canvas;

}
function drawScene(ctx){
    if(VIDEO !=null){
        // keep the middle part of video to put on canvas
        let min = Math.min(VIDEO.videoWidth,VIDEO.videoHeight);
        let sx =(VIDEO.videoWidth-min)*0.5;
        let sy =(VIDEO.videoHeight-min)*0.5;
        ctx.drawImage(VIDEO,sx,sy,min,min,0,0,SIZE,SIZE/*,CANVAS.width,CANVAS.height*/);
    }else{
        ctx.fillText("LOADING",CANVAS.width*0.5,CANVAS.height*0.5);
    }
    let colors = getColorsFrom(ctx);
    applySomeEffect(ctx);
    //drawColorSpace(colors,colorCtx);
    //console.log(colors);
}
function drawColorSpace(colors,ctx){

    //Axes
    
    ctx.clearRect(0,0,SIZE,SIZE);

    ctx.save();
    ctx.fillStyle = 'black';
    ctx.lineWidh =5;
    ctx.scale(0.9,0.9);
    ctx.translate(SIZE*0.05,SIZE*0.05);
    ctx.scale(SIZE/255,-SIZE/255);
    ctx.translate(0,-255);
    //vertical
    
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(255,0);
    ctx.stroke();
    //horizontal
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,255);
    ctx.stroke();
    
    //data points
    for(let i=0;i<colors.length;i++){
        let x=colors[i][0];//red
        let y=colors[i][1];//green

        ctx.beginPath();
        ctx.arc(x,y,2,0,Math.PI*2);
        ctx.fillRect(x,y,10,10);
        ctx.fill();

    }
    ctx.restore();
}
function nextEffect(){
    EFFECT_INDEX++;
    if(EFFECT_INDEX>EFFECTS.length){
        EFFECT_INDEX=0;
    }
}
function applySomeEffect(ctx){
    switch(EFFECTS[EFFECT_INDEX]){
        case "normal":break;
        case "grayScale": applyGrayScale(ctx); break;
        case "grayScaleInvert": applyColorInvert(ctx); applyGrayScale(ctx); break;
        case "invertColor": applyColorInvert(ctx); break;
        case "symetry": applySymetry(ctx); break;
        case "Ghost": applyAverageSymetry(ctx); break;
        case "mirror": applyMirror(ctx); break;
        case "fullmirror": applyFullMirror(ctx); break;
        case "Double": applyDoubleImage(ctx); break;
        case "symetryDiagonal": applyDiagonalSymetry(ctx); break;
        case "stack" : applyMirror(ctx); applyGrayScale(ctx); applyColorInvert(ctx);break;

    }
}


//EFFECTS
function applyGrayScale(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=0;x<SIZE;x++){
            let pixel = getPixelValue(data,x,y);
            let avg = (pixel.red+pixel.green+pixel.blue)/3;
            data[(y*SIZE+x)*4+0]=avg;
            data[(y*SIZE+x)*4+1]=avg;
            data[(y*SIZE+x)*4+2]=avg;
        }
    }
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function applyColorInvert(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=0;x<SIZE;x++){
            let pixel = getPixelValue(data,x,y);

            data[(y*SIZE+x)*4+0]=255-pixel.red;
            data[(y*SIZE+x)*4+1]=255-pixel.green;
            data[(y*SIZE+x)*4+2]=255-pixel.blue;
        }
    }
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function applySymetry(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=SIZE/2;x<SIZE;x++){
            
            let pixel = getPixelValue(data,SIZE-x,y);
            data[(y*SIZE+x)*4+0]=pixel.red;
            data[(y*SIZE+x)*4+1]=pixel.green;
            data[(y*SIZE+x)*4+2]=pixel.blue;
        }
    }
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function applyAverageSymetry(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=0;x<SIZE;x++){
            
            let pixelLeft = getPixelValue(data,SIZE-x,y);
            let pixelRight = getPixelValue(data,x,y);
            data[(y*SIZE+x)*4+0]=(pixelLeft.red+pixelRight.red)/2;
            data[(y*SIZE+x)*4+1]=(pixelLeft.green+pixelRight.green)/2;
            data[(y*SIZE+x)*4+2]=(pixelLeft.blue+pixelRight.blue)/2;
        }
    }
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function applyFullMirror(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=0;x<SIZE/2;x++){
            let pixelRight = getPixelValue(data,(SIZE)-x,y);
            let pixelLeft = getPixelValue(data,x,y);
            let aux= pixelRight;
            pixelRight= pixelLeft;
            pixelLeft=aux;
            data[(y*SIZE+x)*4+0]=pixelLeft.red;
            data[(y*SIZE+x)*4+1]=pixelLeft.green;
            data[(y*SIZE+x)*4+2]=pixelLeft.blue;
            data[(y*SIZE+x)*4+3]=pixelLeft.alpha;
            data[(y*SIZE+(SIZE-x))*4+0]=pixelRight.red;
            data[(y*SIZE+(SIZE-x))*4+1]=pixelRight.green;
            data[(y*SIZE+(SIZE-x))*4+2]=pixelRight.blue;
            data[(y*SIZE+(SIZE-x))*4+3]=pixelRight.alpha;
        }
    }
    
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function applyMirror(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=SIZE/2;x<SIZE;x++){
            let pixel = getPixelValue(data,SIZE-x,y);
            data[(y*SIZE+x)*4+0]=pixel.red;
            data[(y*SIZE+x)*4+1]=pixel.green;
            data[(y*SIZE+x)*4+2]=pixel.blue;
        }
    }
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function applyDoubleImage(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=SIZE/2;x<SIZE;x++){
            let pixel = getPixelValue(data,x-SIZE/2,y);
            data[(y*SIZE+x)*4+0]=pixel.red;
            data[(y*SIZE+x)*4+1]=pixel.green;
            data[(y*SIZE+x)*4+2]=pixel.blue;
        }
    }
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function applyDiagonalSymetry(ctx){
    //access to pixels informations
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    let data = imgData.data;
    //console.log(imgData);
    //on scan vertical
    for(let y=0;y<SIZE;y++){
        //pour chaque ligne,on scanne les pixels
        for(let x=SIZE;x>0;x--){
            let pixel = getPixelValue(data,x,y);
            data[(y*SIZE+x)*4+0]=data[(y+SIZE*x)*4+0];
            data[(y*SIZE+x)*4+1]=data[(y+SIZE*x)*4+1];
            data[(y*SIZE+x)*4+2]=data[(y+SIZE*x)*4+2];
        }
    }
    //on change les valeurs
    ctx.putImageData(imgData,0,0);
}
function getColorsFrom(ctx){
    const colors=[];
    let imgData = ctx.getImageData(0,0,SIZE,SIZE);
    for(let y=0;y<imgData.height;y++){
        for(let x=0;x<imgData.width;x++){
            let px = getPixelValue(imgData,x,y);
            colors.push([px.red,px.green,px.blue,px.alpha]);
        }
    }
    return colors;
}

//initialissation des donnees
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
