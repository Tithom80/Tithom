class Road { 
    constructor(x,width,laneCount=3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = this.x - this.width * 0.5;
        this.right = this.x + this.width * 0.5;

        this.infinity = 10000000;
        this.top = -this.infinity;
        this.bottom = this.infinity;
        const topLeft = {
            x: this.left,
            y:this.top,
        };
        const topRight={
            x: this.right,
            y:this.top,
        };
        const bottomLeft={
            x: this.left,
            y:this.bottom,
        };
        const bottomRight={
            x: this.right,
            y:this.bottom,
        };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];

    }
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 +
        Math.min(laneIndex, this.laneCount-1 )* laneWidth ;

    }
    draw() {
        carCtx.lineWidth = 5;
        carCtx.strokeStyle = 'white';
        for (let i = 1; i <= this.laneCount-1; i++){
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            );
            
            carCtx.setLineDash([20,20]);
            
            carCtx.beginPath();
            carCtx.moveTo(x, this.top);
            carCtx.lineTo(x, this.bottom);
            carCtx.stroke();
        }
        carCtx.setLineDash([]);
        this.borders.forEach(border => {
            carCtx.beginPath();
            carCtx.moveTo(border[0].x, border[0].y);
            carCtx.lineTo(border[1].x, border[1].y);
            carCtx.stroke();
        });
        
    }
};
