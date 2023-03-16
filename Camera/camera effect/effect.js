class EffectColorFinder{
    constructor(canvas,video){
        this.canvas = canvas;
        this.video = video;
        this.ctx=canvas.getContext('2d');

        this.particles =[];
        this.#animate();
    }
    #animate(){
        const{ctx,canvas,video}=this;
        ctx.drawImage(video,0,0,canvas.width,canvas.height);
        const imgData =ctx.getImageData(0,0,canvas.width,canvas.height);
        //console.log(imgData);
        const locs = getLocationWithColor(
            imgData,{r:0,g:0,b:255}
        );
        //ctx.fillStyle='yellow';
        //locs.forEach(loc => {
        //    ctx.fillRect(loc.x,loc.y,1,1);
        //});
        if(locs.length>0){
            const center = average(locs);
            for(let i =0;i<30;i++){
                this.particles.push(new Particle(center));
            }
            
            //ctx.beginPath();
            //ctx.fillStyle = 'red';
            //ctx.arc(center.x,center.y,5,0,Math.PI);
            //ctx.fill();
        }
        this.particles.forEach(p=>{p.update(ctx)});
        while(this.particles.length >0 && this.particles[0].life<=0){
            this.particles.shift();
        }

        
        requestAnimationFrame(this.#animate.bind(this));
    }
}