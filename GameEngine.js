
//------------------------------GAMEENGINE---------------------------------
gameEngine = Class.extend({
	interval: null,
	over: true,
	loaded: 0,
	file: null,

	init: function(file) {
		this.over = true;
		this.file = file;
		this.load();//put this as the last line
	},
	
	load: function() {
		renderingEngine = new RenderingEngine();
		renderingEngine.string = "Loading";
		this.interval = setInterval(renderingEngine.loadingPage, 1000);
		imageManager = new imageManager();
		audio = new audioManager();
	},
	
	checkLoading: function() {
		if (this.loaded == numberToLoad) {
			renderingEngine.string = "";
			clearInterval(game.interval);
			document.getElementById("canvas").addEventListener("mousedown", game.startGame);
			this.interval = setInterval(renderingEngine.waitingPage, 1000);
			clearInterval(renderingEngine.interval);
		}
	},
	
	startGame: function(event) {
		if (event.button == 2) return;
		document.getElementById("canvas").removeEventListener("mousedown", game.startGame);
		clearInterval(game.interval);
		audio.playBackground();
		world = new World(game.file);
		inputManager = new InputManager();
		game.interval = setInterval(game.action, frameRate);
		renderingEngine.createButton("Pause",(20/1200*canvas.width).toString()+"px Georgia", "Pause", pauseResumeButton.x-0.022*canvas.width, pauseResumeButton.y+0.01*canvas.height,
			pauseResumeButton.sx, pauseResumeButton.sy, pauseResumeButton.x, pauseResumeButton.y);
		renderingEngine.createButton("Restart",(18/1200*canvas.width).toString()+"px Georgia", "Restart", restartButton.x-0.022*canvas.width, restartButton.y+0.01*canvas.height,
			restartButton.sx, restartButton.sy, restartButton.x, restartButton.y);
	},

	pause: function() {
		audio.pause();
		clearInterval(this.interval);
	},
	
	resume: function() {
		audio.resume();
		game.interval = setInterval(game.action, frameRate);
	},
	
	action: function() {
		if (world.isGameOver() && game.over) {
			//render
			renderingEngine.createMessage((100/1200*canvas.width).toString()+"px Georgia", 1, 0.34*canvas.width, 0.95*canvas.height, "You Lost!");
			game.over = false;
			audio.stopBackground();
			audio.play("gameover");
		}else if (world.isWin()&& game.over) {
			//render
			renderingEngine.createMessage((100/1200*canvas.width).toString()+"px Georgia", 1, 0.34*canvas.width, 0.95*canvas.height, "You Win!");
			game.over = false;
			audio.stopBackground();
			audio.play("win");
		}
		world.action();
		renderingEngine.render();
	},

	gameOverScreen: function() {
	},

	winScreen: function() {
	},

	restartGame: function(){
		renderingEngine = new RenderingEngine();
		game.over = true;
		inputManager = new InputManager();
		game.startGame(1);
		audio.reset();
	}

});


