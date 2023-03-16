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