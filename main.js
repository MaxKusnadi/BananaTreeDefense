  //---------------------------------------VARIABLES-------------------------------------
var developerMode = false;
var canvas = null;
var ctx = null;
var image = null;
var frameRate = 16.6;
var characterData = null;
var bulletData = null;
var positionData = null;
var world = null;
var renderingEngine = null;
var inputManager = null;
var game = null;
var gravity = null;
var boxPosition = null;
var TREE_POSITION_X = null;
var TREE_POSITION_Y = null;
var SLOTS_POSITION_X = null;
var SLOTS_POSITION_Y = null;
var startingGold = 250;
var audio = null;
var numberToLoad = null;
var coinAcc = null;
var slotSize = null;
var coinSize = null;
var moneyDisplay = null;
var imageData = null;
var imageManager = null;
var pauseResumeButton = null;
var restartButton = null;

//------------------------------MAIN-------------------------------------
var setup = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
	canvas.width = 0.95*window.innerWidth;
	canvas.height = 0.95*window.innerHeight;
	if (canvas.height/canvas.width>0.6) {
		canvas.height = 0.6*canvas.width;
	}else if (canvas.height/canvas.width<0.6) {
		canvas.width = canvas.height/0.6;
	}
	positionData = {0: {x:0, y:0.78*canvas.height}, 1: {x:0, y:0.25*canvas.height}, 2: {x:canvas.width, y:0.25*canvas.height}, 3: {x:canvas.width, y:0.78*canvas.height}};
  boxPosition = {x: 0.03*canvas.width, y:0.0625*canvas.height};
	TREE_POSITION_X = 0.5*canvas.width;
	TREE_POSITION_Y = 0.5*canvas.height;
	SLOTS_POSITION_X = [0.4*canvas.width,0.4*canvas.width,0.4*canvas.width,0.6*canvas.width,0.6*canvas.width,0.6*canvas.width];
	SLOTS_POSITION_Y = [0.75*canvas.height,0.5*canvas.height,0.25*canvas.height,0.25*canvas.height,0.5*canvas.height,0.75*canvas.height];
	gravity = 1.25*canvas.height;
	coinAcc = gravity;
	slotSize = {
  x : 0.02*canvas.width,
  y: 0.05*canvas.height
	};
	coinSize = {x:0.02*canvas.width, y:0.02*canvas.width};
	moneyDisplay = {x:0.70*canvas.width, y:0.07*canvas.height};
	numberToLoad = (function() {var i = 0; for (key in musicData) i++; for (key in imageData) i++; return i;})();
  characterData = data;
  bulletData = bulletData;
	pauseResumeButton = {x:0.90*canvas.width, y: 0.07*canvas.height, sx: 0.03*canvas.width, sy: 0.03*canvas.height};
  
	//game = new gameEngine(level0);
	//new data structure
	game = new gameEngine(1);
};



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
		renderingEngine = new renderingEngine();
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
		}
	},
	
	startGame: function(event) {
		if (event.button == 2) return;
		document.getElementById("canvas").removeEventListener("mousedown", game.startGame);
		clearInterval(game.interval);
		audio.playBackground();
		world = new world(game.file);
		inputManager = new inputManager();
		game.interval = setInterval(game.action, frameRate);
		renderingEngine.createButton("Pause",(20/1200*canvas.width).toString()+"px Georgia", "Pause", pauseResumeButton.x-0.022*canvas.width, pauseResumeButton.y+0.01*canvas.height,
			pauseResumeButton.sx, pauseResumeButton.sy, pauseResumeButton.x, pauseResumeButton.y);
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
			renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 999999, 0.46*canvas.width, 0.94*canvas.height, "You Lost!");
			game.over = false;
      audio.stopBackground();
      audio.play("gameover");
    }else if (world.isWin()&& game.over) {
			//render
			renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 999999, 0.46*canvas.width, 0.94*canvas.height, "You Win!");
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
	}
});


//------------------------------------INPUTMANAGER----------------------------------------

inputManager = Class.extend({
  store: null,
  deploying: null,
	paused: false,
  
  init: function() {
    this.store = [];
    document.getElementById("canvas").addEventListener("mousedown", this.mouseDown);
    document.getElementById("canvas").addEventListener("mousemove", this.mouseMove);
    document.getElementById("canvas").addEventListener("mouseup", this.mouseUp);
  },
  
  retrieve: function() {
    if (this.store.length == 0) return null;
    var x = this.store[0];
    this.store.splice(0,1);
    return x;
  },
	
  mouseDown: function(event) {
		if (event.button == 2) return;
		if (world.isWin() || world.isGameOver()) {
			clearInterval(game.interval);
			game.action();
			document.getElementById("canvas").removeEventListener("mousedown", inputManager.mouseDown);
			document.getElementById("canvas").removeEventListener("mousemove", inputManager.mouseMove);
			document.getElementById("canvas").removeEventListener("mouseup", inputManager.mouseUp);
			if (world.isWin()) {
				game.winScreen();
			}else game.gameOverScreen();
		}
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
		if (inputManager.paused) {
			if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy){
			inputManager.deploying = "resume";
			}
			return;
		}
		if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy){
			inputManager.deploying = "pause";
		}
    for (var i=0; i<6; i++) {
      var slot = world.tree.slots[i];
      if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
        if (slot.monkey) {
          this.rotating = slot.monkey;
          inputManager.store.push(["rotating", this.rotating, slot.number]);
          return null;
        }
      }
    }
    for (var i=0; i<world.deploy.length; i++) {
      var slot = world.deploy[i];
      if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
        this.deploying = slot.monkey;
        return;
      }
    }
  },
  
  mouseUp: function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
		if (inputManager.paused) {
			if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy&&inputManager.deploying=="resume"){
				game.resume();
				inputManager.paused = false;
				renderingEngine.buttons["Resume"].isDead = true;
				renderingEngine.createButton("Pause",(20/1200*canvas.width).toString()+"px Georgia", "Pause", pauseResumeButton.x-0.022*canvas.width, pauseResumeButton.y+0.01*canvas.height,
				pauseResumeButton.sx, pauseResumeButton.sy, pauseResumeButton.x, pauseResumeButton.y);
				audio.playBackground();
			}
			inputManager.deploying = null;
			return;
		}
		if (inputManager.deploying=="pause"){
			if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy){
				game.pause();
				inputManager.paused = true;
				renderingEngine.buttons["Pause"].isDead = true;
				renderingEngine.createButton("Resume",(20/1200*canvas.width).toString()+"px Georgia", "Resume", pauseResumeButton.x-0.03*canvas.width, pauseResumeButton.y+0.01*canvas.height,
				pauseResumeButton.sx, pauseResumeButton.sy, pauseResumeButton.x, pauseResumeButton.y);
				renderingEngine.render();
				audio.stopBackground();
			}
			inputManager.deploying = null;
			return;
		}
    if (this.deploying) {
      for (var i=0; i<6; i++) {
        var slot = world.tree.slots[i];
        if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
          inputManager.store.push(["deploy", this.deploying, i]);
          this.deploying = null;
        }
      }
      this.deploying = null;
      inputManager.store.push(["clear"]);
    }else if (this.rotating) {
      var nearest = null;
      var dist = 9999999999999;
      for (var i=0; i<6; i++) {
        var slot = world.tree.slots[i];
        var currdist = Math.abs(x-slot.x)+Math.abs(y-slot.y);
        if (currdist<dist) {
          dist = currdist;
          nearest = slot;
        }
      }
      inputManager.store.push(["rotate", this.rotating, nearest.number]);
      this.rotating = null;
    }
		if (world.isWin() || world.isGameOver()) {
			clearInterval(game.interval);
			game.action();
			document.getElementById("canvas").removeEventListener("mousedown", inputManager.mouseDown);
			document.getElementById("canvas").removeEventListener("mousemove", inputManager.mouseMove);
			document.getElementById("canvas").removeEventListener("mouseup", inputManager.mouseUp);
			if (world.isWin()) {
				game.winScreen();
			}else game.gameOverScreen();
		}
  },
  
  mouseMove: function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
		for (var i=0; i<world.coins.length; i++) {
			var coin = world.coins[i];
			if (Math.abs(coin.x-x)<=coinSize.x && Math.abs(coin.y-y)<=coinSize.y) {
				inputManager.store.push(["collect", coin]);
			}
		}
    if (this.deploying) {
      inputManager.store.push(["deploying", this.deploying, x, y]);
    }else if(this.rotating) {
      var nearest = null;
      var dist = 99999999999999999;
      for (var i=0; i<6; i++) {
        var slot = world.tree.slots[i];
        var currdist = Math.abs(x-slot.x)+Math.abs(y-slot.y);
        if (currdist<dist) {
          dist = currdist;
          nearest = slot;
        }
      }
      inputManager.store.push(["rotating", this.rotating, nearest.number]);
    }
  },
});
  
