
var siteOnline = "Is the browser online? " + navigator.onLine;

const canvas=document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height = window.innerHeight;

const canvas2=document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
canvas2.width=window.innerWidth;
canvas2.height = window.innerHeight;
function validateForm() {

  class Client {  // Create a class
    constructor(name, email, tel, adresse) {  // Class constructor
      this.clientName = name;  // Class body/properties
      this.clientMail = email;
      this.clientPhone = tel;
      this.clientAdr = adresse;
      function GreetClient(){
        console.log("Hello :"+name+" Your e-mail adresse is :"+email+" Your phone number is :"+tel+" You are located :"+adresse);
      }
      this.greet = GreetClient();
    }
  }
  
  let liste = []
  const name = document.forms["form"]["name"].value;
  const email = document.forms["form"]["email"].value;
  const tel =document.forms["form"]["tel"].value;
  const adresse = document.forms["form"]["adresse"].value;
  if (name == ""&& name.length<6) {
    alert("vous devez écrire votre nom");
    return false;
  }else {
  	liste.push(name);
    //console.log(liste);
  }
  if (email == "") {
    alert("vous devez écrire votre adresse Email");
    return false;
  }else {
  	liste.push(email);
    //console.log(liste);
  }
  if (tel == "") {
    alert("vous devez écrire votre numéro de téléphone");
    return false;
  }else {
    liste.push(tel);
    //console.log(liste);
  }
  if (adresse == "") {
    alert("vous devez écrire votre adresse");
    return false;
  }else {
  	liste.push(adresse);
    //console.log(liste);
  }
  //liste.push(name);
  //liste.push(email);
  //liste.push(adresse);
  //console.log(liste);
  //Sconsole.log("hello");


const newClient = new Client(liste[0],liste[1],liste[2],liste[3]);  // Create an object of Car class 
console.log(newClient);
const sortie = "Nom :"+liste[0]+"<br>"+"E-mail :"+liste[1]+"<br>"+"Téléphone :"+liste[2]+"<br>"+"localité :"+liste[3];
document.getElementById("affichage").innerHTML = sortie;
console.log(sortie);
return newClient;
  
}

function horaires(){
  var date = new Date();
  var heure = date.getHours();
  var jour = date.getDay();
  var jourSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  var jourActuel = jourSemaine[jour];
  var horaires = "";
  if (jourActuel == "Samedi" || jourActuel == "Dimanche"){
    horaires = "Nous sommes fermés le week-end";
  } else if (heure >= 8 && heure < 12){
    horaires = "Nous sommes ouverts de 8h à 12h";
  } else if (heure >= 12 && heure < 18){
    horaires = "Nous sommes ouverts de 12h à 18h";
  } else {
    horaires = "Nous sommes fermés";
  }
  document.getElementById("horaires").innerHTML = horaires;
}



class Symbol{
    constructor(x,y,fontSize,canvasHeight){
        this.x=x;
        this.y=y;
        this.fontSize = fontSize;
        this.canvasHeight= canvasHeight;
        this.characters ='ーぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ゛゜';
        this.text ='';
    }
    draw(context){
        //randomize characters
        this.text = this.characters.charAt(Math.floor(Math.random()*this.characters.length));
        context.fillStyle= 'rgba(255,214,0,1)';
        context.fillText(this.text,this.x * this.fontSize, this.y * this.fontSize);
        if(this.y*this.fontSize>this.canvasHeight && Math.random()>0.99){
            this.y=0;
        }else{
            this.y++;
        }
        //console.log(this.text);
    }
}
class Effect{
    constructor(canvasWidth,canvasHeight){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize=14;
        this.columns=this.canvasWidth/this.fontSize;
        this.symbols=[];
        this.#initialize();
        //console.log(this.symbols);

    }
    #initialize(){
        for(let i=0;i<this.columns;i++){
            this.symbols[i] = 
            new Symbol(i,0,this.fontSize,this.canvasHeight);
        }
    }
}
const effect = new Effect(canvas.width,canvas.height);
let lastTime =0;
const fps = 60;
const nextFrame = 1000/fps;
let timer =0;

function drawTitle(t){
    let text ="Tithom prod";
    ctx.strokeStyle='black';
    ctx.textAlign="center";
    ctx.textBaseline = "top";
    ctx.font = "bold 40px Arial";
    ctx.lineWidth=3;
    ctx.setLineDash([lerp(0,30,t),3]);
    ctx.strokeText(text,canvas2.width/2,canvas2.height/3);
    ctx.setLineDash([]);
    ctx.save();
    ctx.globalAlpha =0.2;
    ctx.fillText(text,canvas2.width/2,canvas2.height/3);
    ctx.restore();

}
function lerp(a,b,t){
    return a+(b-a)*t;

}
function animate(timeStamp){ 
  const deltaTime = timeStamp-lastTime;
  lastTime = timeStamp;
  const sec = new Date().getTime()/1000;
  const t = (Math.sin(sec*Math.PI)+1)/2;
  if(timer > nextFrame){
      ctx.fillStyle= 'rgba(0,0,0,0.05)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font = effect.fontSize +'px monospace';
      effect.symbols.forEach(symbol=> symbol.draw(ctx));
      timer =0;

  }else{
      timer += deltaTime;
  }
  //console.log(effect);
  drawTitle(t);
  requestAnimationFrame(animate);
}
animate(0);
horaires();

