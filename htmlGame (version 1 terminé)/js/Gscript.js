window.addEventListener('load', function () {
	//on récupère le canvas sur le document html
	const canvas = document.getElementById("canvas1");
	const ctx= canvas.getContext("2d");
	canvas.width = 1440;
	canvas.height = 720;
	//on initialise les variables utiles au jeu
	let enemies = [];
	let score = 0;
	let gameOver = false;

	fullScreenButton = document.getElementById("fullScreenButton");
	

	
	class InputHandler {
		constructor() {
			this.keys = [];
			this.touchY = '';
			this.touchX = '';
			this.touchTreshold = 30;
			window.addEventListener('keydown', e => {
				if ((	e.key === 'ArrowDown' ||
						e.key === 'ArrowUp' ||
						e.key === 'ArrowLeft' ||
						e.key === 'ArrowRight')
						&& this.keys.indexOf(e.key) === -1) {
					this.keys.push(e.key);
					
				} else if (e.key === 'Enter' && gameOver) {
					restartGame();
					
				}
				//console.log(e.key, this.keys);
			});
			window.addEventListener('keyup', e => {
				if (	e.key === 'ArrowDown' ||
						e.key === 'ArrowUp' ||
						e.key === 'ArrowLeft' ||
						e.key === 'ArrowRight') {
					this.keys.splice(this.keys.indexOf(e.key),1);

				}
				//console.log(e.key, this.keys);
			});
			//Mobile handler part

			window.addEventListener('touchstart', e => {
				/*console.log("user touch screen");
				console.log(e);
				console.log(e.changedTouches[0].pageY);
				console.log(e.changedTouches[0].pageX);*/
				this.touchY = e.changedTouches[0].pageY;
				this.touchY = e.changedTouches[0].pageX;

			});
			window.addEventListener('touchmove', e => {
				/*console.log("user move on screen");
				console.log(e);
				console.log(e.changedTouches[0].pageY);
				console.log(e.changedTouches[0].pageX);*/
				const swipeDistance = e.changedTouches[0].pageY - this.touchY;
				if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) {
					this.keys.push('swipe up');
					
				} else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
					this.keys.push('swipe down');
					if (gameOver) {
						restartGame();
					}
				}
			});
			window.addEventListener('touchend', e => {
				/*console.log("user end touch screen");
				console.log(e);
				console.log(e.changedTouches[0].pageY);
				console.log(e.changedTouches[0].pageX);*/
				console.log(this.keys);
				this.keys.splice(this.keys.indexOf('swipe up'), 1);
				this.keys.splice(this.keys.indexOf('swipe down'), 1);

			});
		
		}
	
	}
	
	class Player {
		constructor(gameHeight, gameWidth) { 
			this.gameHeight = gameHeight;
			this.gameWidth = gameWidth;
			this.height = 200;
			this.width = 200;
			this.x = 180;
			this.y = this.gameHeight - this.height;
			this.image = document.getElementById("playerImage");
			this.maxFrames = 8;
			this.frameX = 0;
			this.frameY = 0;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000 / this.fps;
			this.speedx = 0;
			//this.speedy = 0;
			this.vy = 0;
			this.wheigt = 1;
		}

		restart() {
			this.x = 180;
			this.y = this.gameHeight - this.height;
			this.maxFrames = 8;
			this.frameY = 0;
			

		}
		draw(context) {
			//context.strokeStyle = "white";
			//context.strokeRect(this.x +5, this.y +15, this.width-10, this.height-10);
			context.beginPath();
			context.arc(this.x + this.width / 2, this.y +15 + this.height / 2, this.width / 3, 0, Math.PI *2);
			//context.stroke();
			context.drawImage(this.image, this.frameX * this.height, this.frameY *this.width, this.height, this.width ,this.x, this.y, this.height, this.width);

		}
		update(input, deltaTime, enemies) {
			//colision detection
			enemies.forEach(enemy => {
				const dx = (enemy.x + enemy.width/2) - (this.x+this.width/2);
				const dy = (enemy.y+enemy.height/2) - (this.y+this.height/2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if(distance < enemy.width/2.5 + this.width/2.5){
					gameOver = true;
					console.log("Collision!!");
				}
				
			});

			//animation
			if (this.frameTimer > this.frameInterval) {
				if (this.frameX >= this.maxFrames) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0; 
			} else {
				this.frameTimer += deltaTime;
			}

			//controles

			//horizontal movement
			if (input.keys.indexOf('ArrowRight') > -1) {
				this.speedx = 5;
				
			} else if (input.keys.indexOf('ArrowLeft') > -1) {
				this.speedx = -5;
			} else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround() || input.keys.indexOf('swipe up') > -1 && this.onGround()) {
				this.vy = -32;
			} else {
				this.speedx = 0;
			}
			
			this.x += this.speedx;
			//limitation dans le cadre(canvas)
			if (this.x < 0) this.x = 0;
			else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

			//jump
			this.y += this.vy;
			if (!this.onGround()) {
				this.vy += this.wheigt;
				this.frameY = 1;
				this.maxFrames = 5;
			} else {
				this.vy = 0;
				this.frameY = 0;
				this.maxFrames = 8;
			}
			if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;

			
		}
		onGround() {
			return this.y >= this.gameHeight - this.height;
		}

	
	}
	
	class Background {
		constructor(gameHeight, gameWidth) {
			this.gameHeight = gameHeight;
			this.gameWidth = gameWidth;
			this.image = document.getElementById("backgroundImage");
			this.width = 2400;
			this.height = 720;
			this.x = 0;
			this.y = 0;
			this.speed = 5;
			

		}
		draw(context) {
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);

		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) this.x = 0;
			
		}
		restart() {
			this.x = 0;
		}
	
	}
	
	class Enemy {
		constructor(gameHeight, gameWidth) {
			this.gameHeight = gameHeight;
			this.gameWidth = gameWidth;
			this.height = 119;
			this.width = 160;
			this.image = document.getElementById("enemyImage");
			this.x = this.gameWidth - this.width;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.maxFrames = 5;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000 / this.fps;
			this.readyToDel = false;
			this.speed = 7;
		}
		draw(context) {
			//context.strokeStyle = "white";
			//context.strokeRect(this.x, this.y, this.width, this.height);
			context.beginPath();
			context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
			//context.stroke();
			context.drawImage(this.image, this.frameX * this.width,0,this.width , this.height, this.x, this.y, this.width, this.height);
			
		}
		update(deltaTime) {
			if (this.frameTimer > this.frameInterval) {
				if (this.frameX >= this.maxFrames) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			} else {
				this.frameTimer += deltaTime;
			}
			
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.readyToDel = true;
				score++;
			}
			
		}
	
	}

	//the game loops and initialisation

	//définir les variables
	//on instancie une classe input,player,background dans la boucle
	const input = new InputHandler();
	const player = new Player(canvas.height, canvas.width);
	//const enemy1 = new Enemy(canvas.height, canvas.width);
	const background = new Background(canvas.height, canvas.width);
	//on défini quelques variables de temps
	let lastTime = 0;
	let enemyTimer = 0;
	let enemyInterval = 3000;
	let randomEnemyInterval = Math.random() * 200 + 1000;
	
	//fabriquer des enemis
	function handelEnemies(deltaTime) {
		if (enemyTimer > enemyInterval + randomEnemyInterval ) {
			enemies.push(new Enemy(canvas.height, canvas.width));
			console.log(enemies);
			enemyTimer = 0;
		} else {
			enemyTimer += deltaTime;
		}
		
		enemies.forEach(enemy => {
			enemy.draw(ctx);
			enemy.update(deltaTime);
			
		});
		enemies = enemies.filter(enemy => !enemy.readyToDel);
	}
	// afficher des informations

	function displayStatusText(context) {
		context.textAlign = "left";
		context.font = "40px Helvetica";
		context.fillStyle = "black";
		context.fillText("Score : " + score, 20, 50);
		context.fillStyle = "white";
		context.fillText("Score : " + score, 22, 52);
		if(gameOver){
			context.textAlign = "center";
			context.fillStyle = "black";
			context.fillText("GAME OVER, try again!", (canvas.width/2), (canvas.height/2));
			context.fillText("Your Score : " + score, (canvas.width/2), (canvas.height/2)+45);
						context.fillStyle = "white";
			context.fillText("GAME OVER, try again!", (canvas.width/2)+2, (canvas.height/2)+2);
			context.fillText("Your Score : " + score, (canvas.width/2)+2, (canvas.height/2)+47);
			context.fillStyle = "black";
			context.fillText("Press enter or swipe down to restart the game", (canvas.width / 2), (canvas.height / 2) + 90);
			context.fillStyle = "white";
			context.fillText("Press enter or swipe down to restart the game", (canvas.width / 2)+2, (canvas.height / 2) + 92);
			console.log("GAME OVER");
		}
	}
	function restartGame() {
		player.restart();
		background.restart();
		enemies = [];
		score = 0;
		gameOver = false;
		animate(0);

	}

	function toogleFullScreen() {
		//console.log(document.fullscreenElement);
		if (!document.fullscreenElement) {
			canvas.requestFullscreen().catch(
				err => {
					alert(`Error, can't enable full screen mode ${err.message}`);
				});
		} else {
			document.exitFullscreen();
			
		}
	}
	fullScreenButton.addEventListener('click', toogleFullScreen);
	//Animer, dessiner et mettre a jour le jeu
	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.height, canvas.width);
		background.draw(ctx);
		background.update();
		player.draw(ctx);
		player.update(input, deltaTime, enemies);
		handelEnemies(deltaTime); 
		displayStatusText(ctx);
		
		if(!gameOver){
			console.log("Running");
			requestAnimationFrame(animate);
		}
		
	}
	animate(0);

});