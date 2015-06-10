var canvas = null;
var ctx = null;
var image = null;
var frameRate = null; //todo
var characterData = null;
var positionData = {"a": {x:0, y:0}, "b": {x:0, y:0}, "c": {x:0, y:0}, "d": {x:0, y:0}};

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
	tree: null,
	objects: null,
	isFinish: false,
	script: null,
	gameOver: false,
	timer: 0,
	nextTimer: null,
	bullets: null,
	
	init: function(file) {
		this.script = file.parse();
		this.tree = new tree(script.level);
		nextTimer = script.events[0].time;
		bullets = [];
		this.objects = {"a": [], "b":[], "c":[], "d":[]}; //a,b,c,d correspond to different direction of spawning
	},
	
	isGameOver: function() {
		if (gameOver) return true;
		return isFinish;
	},
	
	isWin: function() {
		if (!isFinish) return false;
		return (objects["a"].length == 0 && objects["b"].length == 0  && objects["c"].length == 0  && objects["d"].length == 0 );
	},
	
	spawn: function(monster) {
		m = new monster(monster.hp, positionData[monster.position].x, positionData[monster.position].y, monster.damage,
			monster.attackRate, monster.attackRange, monster.vx);
		this.objects[monster.position].push(m);
	},
	
	spawnMonkey: function(monkey, position) {
		if (tree.slots[position] !== null) return false;
		m = new monkey(monkey.hp, position, monkey.damage, monkey.attackRate, monkey.attackRange);
		tree.addMonkey(m);
	},
	
	removeDead: function() {
		for (var i=0; i<4; i++) {
			for (var j=0; j<objects[i].length; j++) {
				if (objects[i][j].isDead) {
					objects[i].splice(j,1);
				}
			}
		}
		for (var i=0; i<bullets.length; i++) {
			if (bullets[i].isDead) {
				bullets.splice(i,1);
			}
		}
	},
	
	action: function() {
		for (var j=0; j<4; j++) {
			for (var i=0; i<objects[j].length; i++) {
				var b = objects[j].action(tree.slots[Math.floor(j*1.5 + 0.5)]);
				if (b) bullets.push(b);
			}
		}
		for (var i=0; i<bullets.length; i++) {
			bullets[i].action();
		}
		tree.action();
		for (var i=0; i<6; i++) {
			var m = tree.slots[i];
			if (m) {
				m.action(objects[Math.floor(i*0.7+0.2)]);
			}
		}
		if (tree.isDead) {
			gameOver = true;
		}
		removeDead();
		if (!isFinnish && time >= nextTimer) {
			spawn(script.events[0]);
			script.events.splice(0,1);
			if (script.events.length == 0) isFinnish = true;
			else nextTimer = script.events[0].time;
		}
	}
});

gameEngine = Class.extend({
	world: null,
	interval: null,
	renderingEngine: null,
	
	init: function(file) {
		this.world = new world(file);
		this.renderingEngine = new renderingEngine(this.world);
		setupInputManager();
		this.interval = setInterval(action, frameRate);
	},
	
	setupInputManager: function() {//this modify the html to setup the appropriate input manager
	},
	
	action: function() {
		world.action();
		renderingEngine.render();
		if (world.isGameOver()) {
			clearInterval(this.interval);
			gameOverScreen();
		}else if (world.isWin()) {
			clearInterval(this.interval);
			winScreen();
		}
	},
	
	gameOverScreen: function() {
		//todo: specify what to do when game is over
	},
	
	winScreen: function() {}
});