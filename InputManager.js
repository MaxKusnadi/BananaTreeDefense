

//------------------------------------INPUTMANAGER----------------------------------------

InputManager = Class.extend({
	store: null,
	deploying: null,
	paused: false,
	status: null,
	rotating: null,

	init: function() {
		this.store = [];
		document.getElementById("canvas").addEventListener("mousedown", this.mouseDown);
		document.getElementById("canvas").addEventListener("mousemove", this.mouseMove);
		document.getElementById("canvas").addEventListener("mouseup", this.mouseUp);
		document.body.onmouseup = function() {
			if (inputManager.deploying !== null) {
				inputManager.deploying = null;
				inputManager.store.push(["clear"]);
			}
			if (inputManager.rotating !== null) {
				inputManager.store.push(["rotate", inputManager.rotating, inputManager.rotating.slotNumber]);
				inputManager.rotating = null;
			}
		};
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
			document.getElementById("canvas").addEventListener("mousedown", (function(event) {var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
			if (Math.abs(restartButton.x-x)<=restartButton.sx &&Math.abs(restartButton.y-y)<=restartButton.sy){
		inputManager.status = "restartGame";}}));
		document.getElementById("canvas").addEventListener("mouseup", (function(event) {var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
			if(inputManager.status=="restartGame"&&Math.abs(restartButton.x-x)<=restartButton.sx &&Math.abs(restartButton.y-y)<=restartButton.sy){
		game.restartGame();
		}}));
			if (world.isWin()) {
				game.winScreen();
			}else game.gameOverScreen();
		}
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		// restart
    if (Math.abs(restartButton.x-x)<=restartButton.sx &&Math.abs(restartButton.y-y)<=restartButton.sy){
     // console.log("AHHAHA");
     inputManager.status = "restartGame";
 }
		if (inputManager.paused) {
			if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy){
				inputManager.status = "resume";
			}
			return;
		}
		if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy){
			inputManager.status = "pause";
		}
		if (Math.abs(upgradeButton.x-x)<=upgradeButton.sx &&Math.abs(upgradeButton.y-y)<=upgradeButton.sy){
			inputManager.status = "upgrade";
		}
		for (var i=0; i<6; i++) {
			var slot = world.tree.slots[i];
			if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
				if (slot.monkey) {
					inputManager.rotating = slot.monkey;
					inputManager.store.push(["rotating", inputManager.rotating, slot.number]);
					return null;
				}
			}
		}
		for (var i=0; i<world.deploy.length; i++) {
			var slot = world.deploy[i];
			if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
				inputManager.deploying = slot.monkey;
				return;
			}
		}
    
},

mouseUp: function(event) {
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	if(inputManager.status=="restartGame"){
		if (Math.abs(restartButton.x-x)<=restartButton.sx &&Math.abs(restartButton.y-y)<=restartButton.sy){
			game.restartGame();
		}else inputManager.status=null;
	}
	if (inputManager.paused) {
		if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy&&inputManager.status=="resume"){
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
	if (inputManager.status=="pause"){
		if (Math.abs(pauseResumeButton.x-x)<=pauseResumeButton.sx &&Math.abs(pauseResumeButton.y-y)<=pauseResumeButton.sy){
			game.pause();
			inputManager.paused = true;
			renderingEngine.buttons["Pause"].isDead = true;
			renderingEngine.createButton("Resume",(20/1200*canvas.width).toString()+"px Georgia", "Resume", pauseResumeButton.x-0.03*canvas.width, pauseResumeButton.y+0.01*canvas.height,
				pauseResumeButton.sx, pauseResumeButton.sy, pauseResumeButton.x, pauseResumeButton.y);
			renderingEngine.render();
			audio.stopBackground();
		}
		inputManager.status = null;
		inputManager.deploying = null;
		return;
	}
	if (inputManager.status=="upgrade"){
		world.upgrade();
		inputManager.status = null;
		return;
	}
	if (inputManager.deploying) {
		for (var i=0; i<6; i++) {
			var slot = world.tree.slots[i];
			if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
				inputManager.store.push(["deploy", inputManager.deploying, i]);
				inputManager.deploying = null;
			}
		}
		inputManager.deploying = null;
		inputManager.store.push(["clear"]);
	}else if (inputManager.rotating) {
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
		inputManager.store.push(["rotate", inputManager.rotating, nearest.number]);
		inputManager.rotating = null;
	}
	if (world.isWin() || world.isGameOver()) {
		clearInterval(game.interval);
		game.action();
		document.getElementById("canvas").removeEventListener("mousedown", inputManager.mouseDown);
		document.getElementById("canvas").removeEventListener("mousemove", inputManager.mouseMove);
		document.getElementById("canvas").removeEventListener("mouseup", inputManager.mouseUp);
		document.getElementById("canvas").addEventListener("mousedown", (function(event) {var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
			if (Math.abs(restartButton.x-x)<=restartButton.sx &&Math.abs(restartButton.y-y)<=restartButton.sy){
		inputManager.status = "restartGame";}}));
		document.getElementById("canvas").addEventListener("mouseup", (function(event) {var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
			if(inputManager.status=="restartGame"&&Math.abs(restartButton.x-x)<=restartButton.sx &&Math.abs(restartButton.y-y)<=restartButton.sy){
		game.restartGame();
		}}));
		if (world.isWin()) {
			game.winScreen();
		}else game.gameOverScreen();
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
	if (inputManager.deploying) {
		inputManager.store.push(["deploying", inputManager.deploying, x, y]);
	}else if(inputManager.rotating) {
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
		inputManager.store.push(["rotating", inputManager.rotating, nearest.number]);
	}
},
});

