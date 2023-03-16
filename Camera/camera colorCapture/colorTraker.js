class EffectColorFinder{
    constructor(canvas,video,COLOR_KEY){
        this.canvas = canvas;
        this.video = video;
        this.ctx=canvas.getContext('2d');
        this.COLOR_KEY= COLOR_KEY;
    }
    update(){
        const{ctx,canvas,COLOR_KEY}=this;
        const imgData =ctx.getImageData(0,0,canvas.width,canvas.height);
        //console.log(imgData);
        const locs = getLocationWithColor(
            imgData,{r:COLOR_KEY[0],g:COLOR_KEY[1],b:COLOR_KEY[2]}
        );
        ctx.fillStyle='rgba(0,0,0,0.1)';
        locs.forEach(loc => {
            ctx.fillRect(loc.x,loc.y,1,1);
        });
    }
}