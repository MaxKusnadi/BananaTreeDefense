var canvas = null;
var ctx = null;
var image = null;
var frameRate = null; //todo

var setup = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	
	ctx.moveTo(0,0);
	ctx.lineTo(1200,0);
	ctx.lineTo(1200,720);
	ctx.lineTo(0,720);
	ctx.lineTo(0,0);
	ctx.stroke();
	/*
	image = new Image();
	image.onload = onloadImage;
	image.src = "./images/Banana_Tree.png";
	*/
};

world = Class.extend({
	objects: null,
	script: null,
	duration: null,//millisecond
	gameOver: false,
	
	init: function(level) {
		this.objects = [];
		this.script = level.parse;
		//set duration
	},
	
	isGameOver: function() {
		if (gameOver) return true;
		return duration <= 0;
	},
		
	insertObject: function(object) {
		objects.push(object);
	},
	
	removeDead: function() {
		for (var i=0; i<objects.length; i++) {
			if (objects[i].isDead) {
				if (objects[i] instanceof tree) {
					this.gameOver = true;
				}
				objects.splice(i,1);
			}
		}
	},
	
	action: function() {
		for (var i=0; i<objects.length; i++) {
			objects[i].action();
		}
		removeDead();
		duration -= frameRate;
	}
});

gameEngine = Class.extend({
	world: null,
	interval: null,
	renderingEngine: null,
	
	init: function() {
		this.world = new world(); //parameter missing
		this.renderingEngine = new renderingEngine(this.world);
		setupInputManager();
		this.interval = setInterval(action, frameRate);
	},
	
	setupInputManager: function() {
	},
	
	action: function() {
		world.action();
		renderingEngine.render();
		if (world.isGameOver()) {
			clearInterval(this.interval);
			gameOverScreen();
		}
	},
	
	gameOverScreen: function() {
		//todo: specify what to do when game is over
	}
});