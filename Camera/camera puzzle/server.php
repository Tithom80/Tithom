<!DOCTYPE html>
<head>
    <title>Linear interpolation</title>
<style>
    body{
        margin: 0;
        overflow: hidden;
    }
</style>
</head>
<body>
    <canvas id="canvas1"></canvas>

    <script>
        canvas1.width=window.innerWidth;
        canvas1.height = window.innerHeight;
//coordonate
        const A = {x:100,y:300};
        const B = {x:400,y:100};
        //3 vectors coodinates
        const orange ={r:230,g:128,b:0}; 
        const blue ={r:0,g:70,b:255}; 
        //sounds
        const lowFreq=250;
        const highFreq=500;

        const ctx= canvas1.getContext('2d');
        //initialisation du context audio multi navigateur

        //audio
        let osc = null;
        let audioCtx =null;
        canvas1.onclick=function(){
            if(audioCtx ==null){
                audioCtx=new (
                    AudioContext ||
                    webkitAudioContext ||
                    window.webkitAudioContext)();
                     console.log(audioCtx);
                    osc= audioCtx.createOscillator();
                    osc.frequency.value=200;
                    osc.start();
                    const node=audioCtx.createGain();
                    node.gain.value=0.05;

                    osc.connect(node);
                    node.connect(audioCtx.destination);
                   
            }
        }
        

        animate();
        function animate(){
            ctx.clearRect(0,0,canvas1.width,canvas1.height);

            const sec = new Date().getTime()/1000;
            //console.log(sec);
            const t = (Math.sin(sec*Math.PI)+1)/2;
//coordonate
            const C = vlerp(A,B,t);
            drawDot(C,"");
            drawDot(A,"A");
            drawDot(B,"B");
//colors vectors
            const {r,g,b}= vlerp(orange,blue,t);
            canvas1.style.backgroundColor =`rgb(${r},${g},${b})`;
//sound oscillator
            if (osc){
                osc.frequency.value=
                lerp(lowFreq,highFreq,t);
            }

            ctx.strokeStyle='white';
            ctx.textAlign="center";
            ctx.textBaseline = "top";
            ctx.font = "bold 40px Arial";
            ctx.lineWidth=3;
            ctx.setLineDash([lerp(0,300,t),150]);
            ctx.strokeText("clic for sound",canvas1.width/2,20);
            ctx.setLineDash([]);
            ctx.save();
            ctx.globalAlpha =0.2;
            ctx.fillText("clic for sound",canvas1.width/2,20);
            ctx.restore();


            requestAnimationFrame(animate);
        }

        //vectorized function
        function vlerp(A,B,t){
            const res={};
            for(let attr in A){
                res[attr]=lerp(A[attr],B[attr],t);
            }
            return res;
            /*return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t)
                }*/

        }

        function lerp(a,b,t){
            return a+(b-a)*t;

        }

        function drawDot(pos,label){
            ctx.beginPath();
            ctx.fillStyle='white';
            ctx.strokeStyle = "black";
            ctx.arc(pos.x,pos.y,10,0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle='black';
            ctx.textAlign="center";
            ctx.textBaseline = "middle";
            ctx.font = "bold 14px Arial";
            ctx.fillText(label,pos.x,pos.y);

        }




    </script>

</body>
</html>