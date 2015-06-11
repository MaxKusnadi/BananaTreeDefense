var canvas = null;
var ctx = null;
var image = null;
var frameRate = 1; //todo
var characterData = null;
var bulletData = null;
var positionData = {0: {x:0, y:0}, 1: {x:0, y:0}, 2: {x:0, y:0}, 3: {x:0, y:0}};
var world = null;
var inputManager = null;
var game = null;
var ohyeah = false;

var setup = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	/*ctx.moveTo(0,0);
	ctx.lineTo(1200,0);
	ctx.lineTo(1200,720);
	ctx.lineTo(0,720);
	ctx.lineTo(0,0);
	ctx.stroke();
	*/
	
	characterData = data;
	bulletData = bulletData;
	game = new gameEngine(level0);
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
	deploy: null,
	
	init: function(file) {
		this.script = file;
		this.tree = new tree(this.script.level);
		this.nextTimer = this.script.events[0].time;
		this.bullets = [];
		this.deploy = [];
		//todo
		for (var i=0; i<this.script.deploy.length; i++) {
			var monkey = characterData.monkeys[this.script.deploy[i]];
			//var m = new monkey()//todo;
		}
		this.objects = {0: [], 1:[], 2:[], 3:[]}; //a,b,c,d correspond to different direction of spawning
	},
	
	isGameOver: function() {
		if (this.gameOver) return true;
		return this.isFinish;
	},
	
	isWin: function() {
		if (!this.isFinish) return false;
		return (this.objects[0].length == 0 && this.objects[1].length == 0  && this.objects[2].length == 0  && this.objects[3].length == 0 );
	},
	
	spawn: function(xx) {
		var mon = characterData.monsters[xx.type];
		var m = new monster(mon.hp, positionData[xx.position].x, positionData[xx.position].y, mon.damage,
			mon.attackRate, mon.attackRange, mon.bulletType, xx["vx"]);
		this.objects[xx.position].push(m);
	},
	
	spawnMonkey: function(mon, position) {
		if (this.tree.slots[position] !== null) return false;
		m = new monkey(mon.hp, position, mon.damage, mon.attackRate, mon.attackRange);
		this.tree.addMonkey(m);
	},
	
	removeDead: function() {
		for (var i=0; i<4; i++) {
			for (var j=0; j<this.objects[i].length; j++) {
				if (this.objects[i][j].isDead) {
					this.objects[i].splice(j,1);
				}
			}
		}
		for (var i=0; i<this.bullets.length; i++) {
			if (this.bullets[i].isDead) {
				this.bullets.splice(i,1);
			}
		}
	},
	
	action: function(list) {
		for (var i=0; i<list.length; i++) {//todo
			if (list[i][0] == "deploying") {}
			else if (list[i][0] == "rotating") {}
			else if (list[i][0] == "deploy") {}
			else if (list[i][0] == "rotate") {}
		}
		for (var j=0; j<4; j++) {
			for (var i=0; i<this.objects[j].length; i++) {
				var b = this.objects[j][i].action(this.tree.slots[Math.floor(j*1.5 + 0.5)]);
				if (b) this.bullets.push(b);
			}
		}
		for (var i=0; i<this.bullets.length; i++) {
			this.bullets[i].action();
		}
		this.tree.action();
		for (var i=0; i<6; i++) {
			var m = this.tree.slots[i].monkey;
			if (m) {
				m.action(this.objects[Math.floor(i*0.7+0.2)]);
			}
		}
		if (this.tree.isDead) {
			this.gameOver = true;
		}
		this.removeDead();
		if (!this.isFinish && this.timer >= this.nextTimer) {
			this.spawn(this.script.events[0]);
			this.script.events.splice(0,1);
			if (this.script.events.length == 0) this.isFinish = true;
			else this.nextTimer = this.script.events[0].time;
		}
		this.timer+=frameRate;
	}
});

gameEngine = Class.extend({
	world: null,
	interval: null,
	renderingEngine: null,
	inputManager: null,
	
	init: function(file) {
		world = new world(file);
		//this.renderingEngine = new renderingEngine(world);
		inputManager = new inputManager();
		this.interval = setInterval(this.action, frameRate);
	},
	
	action: function() {
		world.action(inputManager.store);
		//renderingEngine.render();
		if (world.isGameOver()) {
			console.log('hi');
			clearInterval(game.interval);
			game.gameOverScreen();
		}else if (world.isWin()) {
			clearInterval(game.interval);
			game.winScreen();
		}
	},
	
	gameOverScreen: function() {
		console.log('loser');//todo: specify what to do when game is over
	},
	
	winScreen: function() {console.log('win')}
});
//------------------------------------------------------------------------------------------------
var TREE_POSITION_X = 0;
var TREE_POSITION_Y = 0;
var SLOTS_POSITION_X = [0,0,0,0,0,0];
var SLOTS_POSITION_Y = [0,0,0,0,0,0];

livingBeing = Class.extend({
	hp: null,
	x: null,
	y: null,
	isDead: null,
	
	init: function(hp, x, y) {
		this.hp = hp;
		this.x = x;
		this.y = y;
		this.isDead = false;
	},
	
	reduceHp: function(amt) {
		this.hp -= amt;
		if (this.hp<=0) this.isDead = true;
	},
	
	recoverHp: function(amt) {
		this.hp += amt;
	},
	
	action: function() {}
});

//trees have level and depending on level, the hit point is different?
tree = livingBeing.extend({
	slots: [],
	rotateCoolDown: null,
	coolDownLength: null,
	coolDownRate: null,
	
	init: function(level) {
		this._super(this.generateHp(level), TREE_POSITION_X, TREE_POSITION_Y);
		this.slots = [new slot(this), new slot(this), new slot(this), new slot(this), new slot(this), new slot(this)];
		for (var i=0; i<6; i++) {
			this.slots[i].x = TREE_POSITION_X[i];
			this.slots[i].y = TREE_POSITION_Y[i];
		}
		this.rotateCoolDown = 0;
		this.coolDownLength = this.generateCoolDown(level);
		this.coolDownRate = 0;//this.generateCoolDownRate(level);
	},
	//todo/discuss: generateHp and generateCoolDown
	
	generateCoolDown: function(level) {
		return 1;
	},
	
	generateHp: function(level) {
		return 1;
	},
	
	addMonkey: function(slotNumber, monkey) {
		//check whether it is occupied
		if (this.slots[slotNumber].isOccupied()) return;
		this.slots[slotNumber].insertMonkey(monkey);
	},
	
	removeMonkey: function(slotNumber) {
		this.slots[slotNumber].insertMonkey(null);
	},
	
	rotateClockwise: function() {
		if (this.rotateCoolDown>0) return;
		for (var i=1; i<6; i++) {
			var temp = this.slots[i].monkey;
			this.slots[i].monkey = this.slots[0].monkey;
			this.slots[0].monkey = temp;
		}
		this.resetCooldown();
	},
	
	rotateAnticlockwise: function() {
		if (this.rotateCoolDown>0) return;
		for (var i=5; i>0; i--) {
			var temp = this.slots[i].monkey;
			this.slots[i].monkey = this.slots[0].monkey;
			this.slots[0].monkey = temp;
		}
		this.resetCooldown();
	},
	
	resetCooldown: function() {
		this.rotateCoolDown = this.coolDownLength;
	},
	
	action: function() {
		if (this.rotateCoolDown>0) this.decreaseCoolDown();
		for (var i=0; i<6; i++) {
			if (this.slots[i].monkey) this.slots[i].monkey.action();
		}
	},
	
	decreaseCoolDown: function() {
		if (this.rotateCoolDown == 0) return;
		this.rotateCoolDown = Math.max(0, this.rotateCoolDown - this.coolDownRate);
	}
});

slot = Class.extend({
	tree: null,
	monkey : null,
	x: null,
	y: null,
	
	init: function(tree) {
		this.tree = tree;
	},
	
	reduceHp : function(damage) {
		if (this.monkey) this.monkey.reduceHp(damage);
		else this.tree.reduceHp(damage);
	},
	
	insertMonkey: function(monkey) {
		this.monkey = monkey;
	},
	
	isOccupied: function() {
		return this.monkey!==null;
	}
});

armedBeing = livingBeing.extend({
	damage : null,
	attackRate : null,
	attackRange : null,
	coolDown: 0,
	bulletType: null,
	
	init: function(hp, x, y, damage, attackRate, attackRange, bulletType) {
		this._super(hp, x, y);
		this.damage = damage;
		this.attackRate = attackRate;
		this.attackRange = attackRange;
		this.bulletType = bulletData[bulletType];
	},
	
});



monkey = armedBeing.extend({
	slotNumber :null,
	
	init: function(hp, slotNumber, damage, attackRate, attackRange, bulletType) {
		this._super(hp, SLOTS_POSITION_X[slotNumber], SLOTS_POSITION_Y[slotNumber],
		damage, attackRate, attackRange, bulletType);
		this.slotNumber = slotNumber;
	},
	
	action: function(list) {
		if (this.coolDown>0) this.coolDown -= frameRate;
		var target = this.getTarget(list);
		if (target) {
			return this.attack(target);
		}
		return null;
	},
	
	getTarget: function(list) {
		var result = null;
		var curr = 100; //todo
		for (var i=0; i<list.length(); i++) {
			var diff = Math.abs(list[i].x = this.x);
			if (diff <= this.attackRange && diff < curr) {
				curr = diff;
				result = list[i];
			}
		}
		return result;
	},
	
	attack: function(target) {
		if (this.coolDown>0) return null;
		this.coolDown = this.attackRate;
		t = this.calculateTrajectory(this, target, this.bulletType.v);
		var b = new bullet(this.x, this.y, this.damage, t[0], t[1], t[2], target);
		return b;
	},
	
	calculateTrajectory : function(a, b, v) {
		var diffx = Math.abs(a.x-b.x);
		var diffy = Math.abs(a.y-b.y);
		var hypo = Math.sqrt(diffx*diffx + diffy*diffy);
		return [v/hypo*diffx, v/hypo*diffy, hypo/v];
	}	
});

monster = armedBeing.extend({
	vx: null,
	
	init: function(hp, x, y, damage, attackRate, attackRange, bulletType, vx) {
		this._super(hp, x, y, damage, attackRate, attackRange, bulletType);
		this.vx = vx;
	},
	
	action: function(slot) {
		if (this.coolDown>0) this.coolDown -= frameRate;
		var target = this.getTarget(slot);
		if (target) {
			return this.attack(target);
		} else {
			this.move();
			return null;
		}
	},
	
	move: function() {
		this.x += this.vx;
	},
	
	getTarget: function(slot) {
		if (Math.abs(this.x - slot.x)<=this.attackRange) {
			return slot;
		}
		return null;
	},
	
	attack: function(slot) {
		if (this.coolDown>0) return null;
		this.coolDown = this.attackRate;
		t = this.calculateTrajectory(this, target, this.bulletType.v);
		var b = new bullet(this.x, this.y, this.damage, t[0], t[1], t[2], target);
		return b;
	},
	
	calculateTrajectory : function(a, b, v) {
		var diffx = a.x-b.x;
		var diffy = a.y-b.y;
		var hypo = Math.sqrt(diffx*diffx + diffy*diffy);
		return [v/hypo*diffx, v/hypo*diffy, hypo/v];
	}	
	
});

bullet = Class.extend({
	x: null,
	y: null,
	vx: null,
	vy: null,
	damage: null,
	isDead: null,
	time: null,
	
	init: function(x, y, damage, vx, vy, time, target) {
		this.x = x;
		this.y = y;
		this.damage = damage;
		this.vx = vx;
		this.vy = vy;
		this.isDead = false;
		this.target = target;
		this.time = time;
	},
	
	action: function() {
		if (this.time<=0) {
			this.attack(this.target);
			this.isDead = true;
		}
		else this.move();
	},
	
	attack: function(target) {
		this.target.reduceHp(damage);
	},
	
	move: function() {
		this.time -= frameRate;
		this.x += this.vx;
		this.y += this.vy;
	}
	
});
//--------------------------------------------------------------------------------------------------------
data = {
	monkeys: {
		monkeyType1: {
			hp: 0,
			damage: 0,
			attackRate: 0,
			attackRange: 0,
			renderingData: {
			}
		},
		//...
	},
	
	monsters: {
		"gorilla": {
			hp: 0,
			damage: 0,
			attackRate: 0,
			attackRange: 0,
			bulletType: "type1",
			vx: 0
		},
		//...
	}
}
//-------------------------------------------------------------------------------
bulletData= {
	"type1": {
		v : 1
	}
}
//-----------------------------------------------------------------------------------------
level0 = {
	events: [{
		time: 0,
		type: "gorilla",
		position: 0,
	}, {}],
	level: 1,
	deploy: ["monkeyType1"]
	
}
//------------------------------------------------------------------------------------------

var slotSize = {
	x : 0,
	y: 0
}

inputManager = Class.extend({
	store: null,
	deploying: null,
	
	init: function() {
		this.store = [];
		document.getElementById("canvas").addEventListener("mousedown", this.mouseDown);
		document.getElementById("canvas").addEventListener("mousemove", this.mouseMove);
		document.getElementById("canvas").addEventListener("mouseup", this.mouseUp);
		document.getElementById("canvas").addEventListener("mouseover", this.mouseOver);
	},
	
	retrieve: function() {
		if (this.store.length == 0) return null;
		var x = this.store[0];
		this.store.splice(0,1);
		return x;
	},
	
	mouseDown: function(event) {
		ohyeah = true;
		var x = event.clientX;
		var y = event.clientY;
		console.log(x+','+y);
		for (var i=0; i<6; i++) {
			var slot = world.tree.slots[i];
			if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
				if (slot.monkey) {
					this.rotating = slot.monkey;
					return;
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
		ohyeah = false;
		var x = event.clientX;
		var y = event.clientY;
		console.log(x+','+y);
		if (this.deploying) {
			for (var i=0; i<6; i++) {
				var slot = world.tree.slots[i];
				if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
					this.store.push(["deploy", this.deploying, i]);
					break;
				}
			}
			this.deploying = null;
		}else if (this.rotating) {
			for (var i=0; i<6; i++) {
				var slot = world.tree.slots[i];
				if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
					this.store.push(["rotate", this.rotating, i]);
					break;
				}
			}
			this.rotating = null;
		}
	},
	
	mouseMove: function(event) {
		var x = event.clientX;
		var y = event.clientY;
		if (ohyeah) {
			ctx.fillRect(x,y,1,1);
		}
		
		console.log(event.clientX+','+event.clientY);
		if (this.deploying) {
			this.store.push(["deploying", this.deploying, x, y]);
		}else if(this.rotating) {
			var nearest = null;
			var dist = 100;
			for (var i=0; i<6; i++) {
				var slot = world.tree.slots[i];
				var currdist = Math.abs(x-slot.x)+Math.abs(y-slot.y);
				if (currdist<dist) {
					dist = currdist;
					nearest = slot;
				}
			}
			this.store.push(["rotating", nearest]);
		}
	},
});
	
	
	
					
	