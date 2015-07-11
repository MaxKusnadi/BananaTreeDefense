

//------------------------------------INPUTMANAGER----------------------------------------

InputManager = Class.extend({
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
    // restart
    if (Math.abs(restartButton.x-x)<=restartButton.sx &&Math.abs(restartButton.y-y)<=restartButton.sy){
     // console.log("AHHAHA");
     inputManager.deploying = "restartGame";
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
	if(inputManager.deploying=="restartGame"){
		game.restartGame();
	}
},

mouseMove: function(event) {
	if(inputManager.paused) return;
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

