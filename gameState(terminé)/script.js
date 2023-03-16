import Player from "./player.js";
import InputHandler from "./input.js";
import { drawStatusText } from "./utils.js";


window.addEventListener('load', function () {
    //On charge la page
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    //on récupère le canvas sur le document html
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;//window.innerWidth;
    canvas.height = 500; //window.innerHeight;

    //on initialise les variables utiles au jeu
    const player = new Player(canvas.width, canvas.height);
    //console.log(player);
    const input = new InputHandler();

    let debugging=true;

    window.addEventListener('keydown', e =>{
        //console.log(e);
        if(e.code =="KeyD"){
            debugging = !debugging;
            //console.log(debugging);
        }
    });

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = deltaTime;
        //on efface le canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //console.log(input.lastKey);
        //console.log(input.keys);
        player.update(input.lastKey);
        player.draw(ctx,deltaTime);
        if(debugging){
            drawStatusText(ctx, input, player);

        }
        
        //on raffraichis les images
        requestAnimationFrame(animate);
    };
    animate(0);
   
});

   
