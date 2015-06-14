  //---------------------------------------VARIABLES-------------------------------------
var canvas = null;
var ctx = null;
var image = null;
var frameRate = 16.6; //todo
var characterData = null;
var bulletData = null;
var positionData = {0: {x:0, y:540}, 1: {x:0, y:180}, 2: {x:1200, y:180}, 3: {x:1200, y:540}};
var world = null;
var renderingEngine = null;
var inputManager = null;
var game = null;
var gravity = 900;
var boxPosition = {x: 35, y:45};
var TREE_POSITION_X = 590;
var TREE_POSITION_Y = 360;
var SLOTS_POSITION_X = [500,500,500,700,700,700];
var SLOTS_POSITION_Y = [540,360,180,180,360,540];
var startingGold = 150;
var slotSize = {
  x : 25,
  y: 35
};
var MONEY_POSITION = [900,700];
var coinSize = {x:25, y:25};
//----------------------------------------GAMEDATA-----------------------------------------------------------
//---------------------------------------CHARACTER DATA-----------------------------------------------------
var data = {
  monkeys: {
    "Soldier": {
      hp: 500,
      damage: 30,
      attackRate: 1,
      attackRange: 300,
      bulletType: "type1",
      cost: 50
    },
    "Archer": {
      hp: 300,
      damage: 50,
      attackRate: 0.5,
      attackRange: 600,
      bulletType: "type2",
      cost: 80
    }
    //...
  },
  
  monsters: {
    "Gorilla": {
      hp: 200,
      damage: 20,
      attackRate: 0.8,
      attackRange: 200,
      bulletType: "type1",
      vx: 70,
      reward: 15
    }, 
    "Kingkong": {
      hp: 250,
      damage: 60,
      attackRate: 1.5,
      attackRange: 50,
      bulletType: "type1",
      vx: 50,
      reward: 25
    }
    //...
  }
}
//---------------------------BULLET DATA--------------------------------
var bulletData= {
	"type1": {
		v : 240,
		type : "straight"
	},
	"type2": {
		v: 300,
		type : "projectile"
	}
}
//---------------------------BULLET DATA--------------------------------
var musicData ={
  "background":{
    src: "audio/bg.mp3",
    loop: true,
    volume: 0.3
  },
  "monkeySpawn":{
    src: "audio/monkey.mp3",
    loop: false,
    volume: 0.8
  },
  "pickCoin":{
    src:"audio/pickCoin.wav",
    loop: false,
    volume: 0.4
  },
  "monkeyShoot":{
    src:"audio/shoot.wav",
    loop: false,
    volume: 0.2
  },
  "gameover":{
    src:"audio/gameover.wav",
    loop: false,
    volume: 0.4
  },
  "win":{
    src:"audio/win.wav",
    loop:false,
    volume:0.4
  },
  "hit":{
    src:"audio/hit.wav",
    loop:false,
    volume:1
  }
}
//----------------------------LEVEL DATA-------------------------------------------------------------
level0 = {
  events: [{
    time: 1,
    type: "Gorilla",
    position: 0
  }, {
    time: 1,
    type: "Gorilla",
    position: 1
  },{
    time: 3,
    type: "Gorilla",
    position: 1
  },{
    time: 1,
    type: "Gorilla",
    position: 2
  },{
    time: 5,
    type: "Kingkong",
    position: 3
  }
    
    
    ],
  level: 1,
  deployNumber: 2,
  deploy: ["Soldier", "Archer"]

}
//------------------------------MAIN-------------------------------------
var setup = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  //canvas.width = document.body.clientWidth;
  //canvas.height = document.body.clientHeight;
  
  //render
  ctx.moveTo(0,0);
  ctx.lineTo(1200,0);
  ctx.lineTo(1200,720);
  ctx.lineTo(0,720);
  ctx.lineTo(0,0);
  ctx.moveTo(0,90);
  ctx.lineTo(1200,90);
  ctx.moveTo(0,585);
  ctx.lineTo(1200,585);
  ctx.stroke();
  
  
  characterData = data;
  bulletData = bulletData;
  game = new gameEngine(level0);
  /*
  image = new Image();
  image.onload = onloadImage;
  image.src = "./images/Banana_Tree.png";
  */
};

//------------------------------GAMEENGINE---------------------------------
gameEngine = Class.extend({
  world: null,
  interval: null,
  renderingEngine: null,
  inputManager: null,
	over: true,
  
  init: function(file) {
    world = new world(file);
    renderingEngine = new renderingEngine();
    inputManager = new inputManager();
		this.over = true;
    this.interval = setInterval(this.action, frameRate);
  },
  
  action: function() {
	  //render
    ctx.clearRect(1,91,canvas.width-2, canvas.height-227);
    ctx.clearRect(1,1,1198,88);
    ctx.clearRect(1,586,canvas.width-2, 133);
	ctx.font="20px Georgia";
	ctx.fillText("Tree Hp: "+Math.round(world.tree.hp),550,50);
	ctx.fillText("Money: "+world.money, 850, 50);
    //renderingEngine.render();
    if (world.isGameOver() && game.over) {
			//render
			renderingEngine.createMessage("20px Georgia", 999999, 550, 680, "You Lost!");
			game.over = false;
      world.audio.stop("background");
      world.audio.play("gameover");
    }else if (world.isWin()&& game.over) {
			//render
			renderingEngine.createMessage("20px Georgia", 999999, 550, 680, "You Win!");
			game.over = false;
      world.audio.stop("background");
      world.audio.play("win");
    }
		world.action();
		renderingEngine.render();
  },
  
  gameOverScreen: function() {
  },
  
  winScreen: function() {
	}
});

//------------------------------RENDERINGENGINE-------------------------------
renderingEngine = Class.extend({
	messages: null,
	
	init: function() {
		this.messages = [];
	},
	
	createMessage: function(style, duration, x, y, text) {
		this.messages.push(new message(style, duration, x, y, text));
	},
	
	render: function() {
		for (var i=0; i<this.messages.length; i++) {
			this.messages[i].render();
		}
	}
});
		

//------------------------------------INPUTMANAGER----------------------------------------

inputManager = Class.extend({
  store: null,
  deploying: null,
  
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
  
//--------------------------------CLASS-------------------------------------------

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
  buffer: null,
  rotateBuffer: null,
  money: null,
	coins: null,
  audio: null,
  
  init: function(file) {
    this.script = file;
    this.tree = new tree(this.script.level);
    this.nextTimer = this.script.events[0].time;
    this.bullets = [];
    this.deploy = [];
    this.rotateBuffer = [];
    this.money = startingGold;
		this.coins = [];
    this.audio = new audioManager();
    this.audio.play("background");
    //todo
    for (var i=0; i<this.script.deploy.length; i++) {
      this.deploy.push(new slot(null,null));
      var box = this.deploy[i];
      box.x = boxPosition.x+(i*2*slotSize.x);
      box.y = boxPosition.y;
      var m = new dummyMonkey(this.script.deploy[i]);
      m.x = box.x;
      m.y = box.y;
      box.monkey = m;
    }
    this.objects = {0: [], 1:[], 2:[], 3:[]}; //a,b,c,d correspond to different direction of spawning
  },
  
  isGameOver: function() {
    return this.gameOver;
  },
  
  isWin: function() {
    if (!this.isFinish) return false;
    return (this.objects[0].length == 0 && this.objects[1].length == 0  && this.objects[2].length == 0  && this.objects[3].length == 0 );
  },
  
  spawn: function(xx) {
    var mon = characterData.monsters[xx.type];
    var m = new monster(mon.hp, positionData[xx.position].x, positionData[xx.position].y, mon.damage,
      mon.attackRate, mon.attackRange, mon.bulletType, ((xx.position)>1 ? -mon.vx: mon.vx), mon.reward, xx.type);
    this.objects[xx.position].push(m);
  },
  
  spawnMonkey: function(mon, position) {
    if (this.tree.slots[position].monkey !== null){
      return;
    }else if (characterData.monkeys[mon].cost > this.money) {
			renderingEngine.createMessage("20px Georgia", 3, 550, 650, "You Need More Gold");
			return;
		}
    mm = characterData.monkeys[mon];
    m = new monkey(mm.hp, position, mm.damage, mm.attackRate, mm.attackRange, mm.bulletType, mm.cost, mon);
    this.tree.addMonkey(position, m);
    this.money -= mm.cost;
    this.audio.play("monkeySpawn");
  },
  
	
	removeDead: function() {
		var remove = (function(list) {
		var i=0;
		while(i<list.length) {
			if(list[i].isDead) {
				list.splice(i,1);
			}else i++;
		}
	});
    for (var i=0; i<4; i++) {
			remove(this.objects[i]);
    }
    remove(this.bullets);
    for (var i=0; i<6; i++) {
      var m = world.tree.slots[i].monkey;
      if (m && m.isDead) world.tree.slots[i].monkey = null;
    }
		remove(this.coins);
		remove(renderingEngine.messages);
  },
  
  action: function() {
    list = inputManager.retrieve();
    while (list) {
      if (list[0] == "deploying") {
        if (!this.buffer) {
          this.buffer = new dummyMonkey(list[1].type);
        }
        this.buffer.x = list[2];
        this.buffer.y = list[3];
      }
      else if (list[0] == "rotating") {
        if (this.rotateBuffer.length==0) {
          for (var i=0; i<6; i++) {
            var m = world.tree.slots[i].monkey;
            if (m) {
              this.rotateBuffer.push(new dummyMonkey(m.type));
              this.rotateBuffer[i].x = m.x;
              this.rotateBuffer[i].y = m.y;
            } else this.rotateBuffer.push(null);
          }
          this.rotateBuffer.push(list[2]);
        }else{
          var diff = (list[2] - this.rotateBuffer[6]+6)%6;
          for (var i=0; i<6; i++) {
            if (this.rotateBuffer[i]) {
              this.rotateBuffer[i].x = SLOTS_POSITION_X[(diff+i)%6];
              this.rotateBuffer[i].y = SLOTS_POSITION_Y[(diff+i)%6];
            }
          }
        } 
      }
      else if (list[0] == "deploy") {
        world.spawnMonkey(list[1].type, list[2]);
        this.buffer = null;
      }
      else if (list[0] == "rotate") {
        world.tree.rotateClockwise((list[2] - this.rotateBuffer[6]+6)%6);
        this.rotateBuffer = [];
      }
      else if (list[0] == "clear") {
        this.buffer = null;
      }
			else if (list[0] == "collect") {
				if (list[1].isDead == false) {
					list[1].isDead = true;
					world.money += list[1].value;
          world.audio.play("pickCoin");
				}
			}
      list = inputManager.retrieve();
    }
    for (var j=0; j<4; j++) {
      for (var i=0; i<this.objects[j].length; i++) {
        var b = this.objects[j][i].action(this.tree.slots[Math.floor(j*1.5 + 0.5)]);
        if (b) this.bullets.push(b);
      }
    }
    for (var i=0; i<6; i++) {
		//render
      ctx.fillRect(this.tree.slots[i].x-slotSize.x, this.tree.slots[i].y-slotSize.y, 2*slotSize.x,2*slotSize.y);
      ctx.clearRect(this.tree.slots[i].x-slotSize.x+1, this.tree.slots[i].y-slotSize.y+1, 2*slotSize.x-2,2*slotSize.y-2);
      if (this.tree.slots[i].monkey) {
        var b = this.tree.slots[i].monkey.action(world.objects[Math.floor(i*0.7+0.2)]);
        if (b) this.bullets.push(b);
      }
    }
    for (var i=0; i<this.bullets.length; i++) {
      this.bullets[i].action();
    }
    this.tree.action();
    if (this.tree.isDead) {
      this.gameOver = true;
    }
	//render
	ctx.font="15px Georgia";
    for (var i=0; i<this.deploy.length; i++) {
		//render
      this.deploy[i].monkey.action();
	  ctx.fillText(characterData.monkeys[this.deploy[i].monkey.type].cost, this.deploy[i].x, this.deploy[i].y-10);
    }
	//render
		for (var i=0; i<this.coins.length; i++) {
			this.coins[i].action();
			ctx.font="30px Georgia";
			ctx.fillText("$", this.coins[i].x, this.coins[i].y);
			//ctx.fillRect(this.coins[i].x-coinSize.x,this.coins[i].y-coinSize.y, 2*coinSize.x, 2*coinSize.y);
		}
	//render
    if(this.buffer) {
      this.buffer.action();
    }
	//render
    if (this.rotateBuffer.length>0) {
      for (var i=0; i<6; i++) {
        if (this.rotateBuffer[i]) {
          this.rotateBuffer[i].action();
        }
      }
    }
    this.removeDead();
	//todo add wave feature
    while (!this.isFinish && this.timer >= this.nextTimer) {
      this.spawn(this.script.events[0]);
      this.script.events.splice(0,1);
      if (this.script.events.length == 0) {
        this.isFinish = true;
      }
      else this.nextTimer = this.script.events[0].time;
    }
    this.timer+=frameRate/1000;
  }
});

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
		this.hp = Math.max(this.hp- amt,0);
    if (this.hp<=0){
      this.isDead = true;
    }
    world.audio.play("hit"); 
  },
  
  recoverHp: function(amt) {
    this.hp += amt;
  },
  
  action: function() {}
});

tree = livingBeing.extend({
  slots: [],
  rotateCoolDown: null,
  coolDownLength: null,
  coolDownRate: null,
  
  init: function(level) {
    this._super(this.generateHp(level), TREE_POSITION_X, TREE_POSITION_Y);
    this.slots = [new slot(this,0), new slot(this,1), new slot(this,2), new slot(this,3), new slot(this,4), new slot(this,5)];
    for (var i=0; i<6; i++) {
      this.slots[i].x = SLOTS_POSITION_X[i];
      this.slots[i].y = SLOTS_POSITION_Y[i];
    }
    this.rotateCoolDown = 0;
    this.coolDownLength = this.generateCoolDown(level);
    this.coolDownRate = frameRate/1000;
  },
  //todo/discuss: generateHp and generateCoolDown
  
  generateCoolDown: function(level) {
    return 5;
  },
  
  generateHp: function(level) {
    return 1000;
  },
  
  addMonkey: function(slotNumber, monkey) {
    //check whether it is occupied
    if (this.slots[slotNumber].isOccupied()) return;
    this.slots[slotNumber].insertMonkey(monkey);
  },
  
  removeMonkey: function(slotNumber) {
    this.slots[slotNumber].insertMonkey(null);
  },
  
  rotateClockwise: function(diff) {
    if (this.rotateCoolDown>0 || diff==0) return;
    var s = [];
    for (var i=0; i<6; i++) {
      s.push(world.tree.slots[(i+6-diff)%6]);
      s[i].x = SLOTS_POSITION_X[i];
      s[i].y = SLOTS_POSITION_Y[i];
      var m = s[i].monkey;
      if (m) {
        m.x = SLOTS_POSITION_X[i];
        m.y = SLOTS_POSITION_Y[i];
      }
    }
    world.tree.slots = s;
    this.resetCooldown();
  },
  
  resetCooldown: function() {
    this.rotateCoolDown = this.coolDownLength;
  },
  
  action: function() {
	  //render
    ctx.fillRect(this.x,this.y,20,20);
	ctx.font="20px Georgia";
	ctx.fillText("CoolDown: "+Math.round(this.rotateCoolDown), 550, 85);
    if (this.rotateCoolDown>0) this.decreaseCoolDown();
    
      /*
      ctx.moveTo(this.slots[i].x-slotSize.x,this.slots[i].y-slotSize.y);
      ctx.lineTo(this.slots[i].x+slotSize.x,this.slots[i].y-slotSize.y);
      ctx.lineTo(this.slots[i].x+slotSize.x,this.slots[i].y+slotSize.y);
      ctx.lineTo(this.slots[i].x-slotSize.x,this.slots[i].y+slotSize.y);
      ctx.lineTo(this.slots[i].x-slotSize.x,this.slots[i].y-slotSize.y);
      ctx.stroke();
      */
      
  },
  
  decreaseCoolDown: function() {
    if (this.rotateCoolDown == 0) return;
    this.rotateCoolDown = Math.max(0, this.rotateCoolDown - this.coolDownRate);
  }
});

dummyMonkey = Class.extend({
  x: null,
  y: null,
  type: null,
  
  init: function(type) {
    this.type = type;
  },
  
  //render
  action: function() {
	  ctx.font="15px Georgia";
	  ctx.fillText(this.type, this.x-20, this.y +30);
    ctx.fillRect(this.x, this.y, 10, 10);
  }
});
    
slot = Class.extend({
  tree: null,
  monkey : null,
  x: null,
  y: null,
  number: null,
  moved: false,
  
  init: function(tree, number) {
    this.tree = tree;
    this.number = number;
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
  cost : null,
  type : null,
  
  init: function(hp, slotNumber, damage, attackRate, attackRange, bulletType, cost, type) {
    this._super(hp, SLOTS_POSITION_X[slotNumber], SLOTS_POSITION_Y[slotNumber],
    damage, attackRate, attackRange, bulletType);
    this.slotNumber = slotNumber;
    this.cost = cost;
	this.type = type;
  },
  
  action: function(list) {
	  //render
	  ctx.font="15px Georgia";
	  ctx.fillText(this.type, this.x-20, this.y-10);
    ctx.fillRect(this.x, this.y, 10,10);
    if (this.coolDown>0){
      this.coolDown -= frameRate/1000;
      return;
    }
    var target = this.getTarget(list);
    if (target) {
      return this.attack(target);
    }
    return null;
  },
  
  getTarget: function(list) {
    var result = null;
    var curr = 10000
    for (var i=0; i<list.length; i++) {
      var diff = Math.abs(list[i].x - this.x);
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
    var b = new bullet(this.x, this.y, this.damage, this.bulletType.v, target, this.bulletType.type);
    world.audio.play("monkeyShoot");
    return b;
  }
});

monster = armedBeing.extend({
  vx: null,
  moved: false,
  reward: null,
  type: null,
  
  init: function(hp, x, y, damage, attackRate, attackRange, bulletType, vx, reward, type) {
    this._super(hp, x, y, damage, attackRate, attackRange, bulletType);
    this.vx = vx;
    this.reward = reward;
	this.type = type;
  },
  
  action: function(slot) {
	  //render
	  ctx.font="15px Georgia";
	  ctx.fillText(this.type, this.x-20, this.y-10);
    ctx.fillRect(this.x,this.y,10,10);
    if (this.coolDown>0) this.coolDown -= frameRate/1000;
    var target = this.getTarget(slot);
    if (target) {
      this.moved = false;
      return this.attack(target);
    } else {
      this.move();
      return null;
    }
  },
  
  reduceHp: function(damage){
    this.hp -= damage;
    if (this.hp<=0 && !this.isDead){
      this.isDead = true;
			for (var i=0; i<this.reward/5; i++) {
				world.coins.push(new coin(this.x, this.y));
			}
    }

  },
  move: function() {
    this.x += this.vx/1000*frameRate;
    this.moved = true;
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
    var b = new bullet(this.x, this.y, this.damage, this.bulletType.v, slot, this.bulletType.type);
    return b;
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
  v: null,
  target: null,
  action: null,
  calculateTrajectory: null,
  
  init: function(x, y, damage, v, target, type) {
    if (type == "straight") {
      this.action = (function() {
        ctx.fillRect(this.x, this.y, 5,5);
        this.time -= frameRate/1000;
        if (this.time<=0) {
          this.attack(this.target);
          this.isDead = true;
        }
          else this.move();
      });
      this.calculateTrajectory = (function(a, b, v) {
        var diffx = b.x-a.x;
        var diffy = b.y-a.y;
        if (b instanceof monster) {
          var pos = diffx>=0 ? true : false;
          var x0 = Math.abs(diffx);
          var y0 = Math.abs(diffy);
          var vg = b.vx;
          if (v == Math.abs(vg)) {
            var x = (y0*y0+x0*x0)/2/x0;
          }
          else{
            var x = (vg*vg*x0-Math.sqrt(Math.pow(vg,4)*x0*x0-(vg*vg-v*v)*vg*vg*(y0*y0+x0*x0)))/(vg*vg-v*v);
          }
          diffx = pos ? (x0-x) : (x-x0);
          if (b.attackRange>(pos?diffx:-diffx)) {
            diffx = pos ? (b.attackRange) : -1*b.attackRange;
          }
        }
        var hypo = Math.sqrt(diffx*diffx + diffy*diffy);
        return [v/hypo*diffx, v/hypo*diffy, hypo/v];
        
      });
    }
    else if (type == "projectile") {
      this.action = (function() {
        ctx.fillRect(this.x, this.y, 5,5);
        this.time -= frameRate/1000;
        if (this.time<=0) {
          this.attack(this.target);
          this.isDead = true;
        }else {
          this.vy += gravity/1000*frameRate/1000*frameRate;
          this.move();
        }
      });
      this.calculateTrajectory = (function(a, b, v) {
        var diffx = b.x-a.x;
        var diffy = b.y-a.y;
        if (b instanceof monster) {
          var pos = diffx>=0 ? true : false;
          var x0 = Math.abs(diffx);
          var y0 = Math.abs(diffy);
          var vg = b.vx;
          if (v == Math.abs(vg)) {
            var x = (y0*y0+x0*x0)/2/x0;
          }
          else{
            var x = (vg*vg*x0-Math.sqrt(Math.pow(vg,4)*x0*x0-(vg*vg-v*v)*vg*vg*(y0*y0+x0*x0)))/(vg*vg-v*v);
          }
          diffx = pos ? (x0-x) : (x-x0);
          if (b.attackRange>(pos?diffx:-diffx)) {
            diffx = pos ? (b.attackRange) : -1*b.attackRange;
          }
        }
        var hypo = Math.sqrt(diffx*diffx + diffy*diffy);
        var time = hypo/v;
        return [diffx/time, diffy/time - 1/2*gravity*time, time];
      });
    }
    this.x = x;
    this.y = y;
    var t = this.calculateTrajectory(this, target, v);
    this.damage = damage;
    this.vx = t[0]/1000*frameRate;
    this.vy = t[1]/1000*frameRate;
    this.isDead = false;
    this.target = target;
    this.time = t[2];
    this.v = v;
  },
  
  
  attack: function(target) {
    this.target.reduceHp(this.damage);
  },
  
  move: function() {
    this.x += this.vx;
    this.y += this.vy;
  } 

});

coin = Class.extend({
	x: null,
	y: null,
	vy: null,
	value: null,
	isDead: false,
	a: null,
	vx: null,
	
	init: function(x,y) {
		this.value = 5;
		this.x = x;
		this.y = y;
		this.vx = Math.random()*100-50;
		this.vy = -250+ Math.random()*50-25;
		this.time = this.calculateTime();
	},
	
	 move: function() {
		 
		this.vy += gravity/1000*frameRate;
    this.y += this.vy/1000*frameRate;
		this.y = Math.min(this.y, SLOTS_POSITION_Y[0]);
		this.x += this.vx/1000*frameRate;
  },
	
	action: function() {
		if (this.time<=0) return;
		this.time -= frameRate/1000;
		this.move();
	},
	
	calculateTime: function() {
		return (-1*this.vy+Math.sqrt(this.vy*this.vy+2*gravity*(SLOTS_POSITION_Y[0]-this.y)))/gravity;
	}
});

message = Class.extend({
	x: null,
	y: null,
	time: null,
	m: null,
	style: null,
	isDead: false,
	
	init: function(style, duration, x, y, m) {
		this.x = x;
		this.y = y;
		this.time = duration;
		this.m = m;
		this.style = style;
	},
	
	render: function() {
		if (this.time <=0 ) isDead = true;
		else {
			ctx.font = this.style;
			ctx.fillText(this.m, this.x, this.y);
			this.time -=frameRate/1000;
		}
	}
});

audioManager = Class.extend({
  collections: null,
  context: null,

  init: function(){
    this.collections = {};
    for(var key in musicData){
      this.context = new Audio(musicData[key].src);
      this.context.loop = musicData[key].loop;
      this.context.volume = musicData[key].volume;
      this.collections[key] = this.context;
    } 
  },

  play: function(name){
    this.collections[name].play();
  },

  stop: function(name){
    this.collections[name].pause();
  }

});