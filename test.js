  //---------------------------------------VARIABLES-------------------------------------
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
//----------------------------------------GAMEDATA-----------------------------------------------------------
//---------------------------------------CHARACTER DATA-----------------------------------------------------
var data = {
  monkeys: {
    "Soldier": {
      hp: 500,
      damage: 40,
      attackRate: 1,
      attackRange: 300,
      bulletType: "type2",
      cost: 50
    },
    "Archer": {
      hp: 300,
      damage: 50,
      attackRate: 0.65,
      attackRange: 600,
      bulletType: "type2",
      cost: 90
    }
    //...
  },
  
  monsters: {
    "Cow": {
      hp: 250,
      damage: 20,
      attackRate: 0.8,
      attackRange: 200,
      bulletType: "type1",
      vx: 70,
      reward: 25
    }, 
    "Chicken": {
      hp: 500,
      damage: 60,
      attackRate: 1.8,
      attackRange: 50,
      bulletType: "type1",
      vx: 50,
      reward: 30
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
		v: 240,
		type : "projectile"
	}
}
//---------------------------MUSIC DATA--------------------------------
var musicData ={
  "background":{
    src: "audio/bg.mp3",
    loop: true,
    volume: 0.3
  },
  "monkeySpawn":{
    src: "audio/monkey.mp3",
    loop: false,
    volume: 0.6
  },
  "Cow":{
    src: "audio/cow.wav",
    loop: false,
    volume: 0.6
  },
  "Chicken":{
    src: "audio/chicken.mp3",
    loop: false,
    volume: 0.6
  },
  "pickCoin":{
    src:"audio/pickCoin.wav",
    loop: false,
    volume: 0.4
  },
  "monkeyShoot":{
    src:"audio/shoot.wav",
    loop: false,
    volume: 0.1
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
    volume: 0.2
  }
}

//----------------------------IMAGE DATA-------------------------------------------------------------
var imageData = {
  "coin" : {
    src: "images/coin.png",
    sizeX: 32,
    sizeY: 32,
    numX: 8,
    numY: 1,
    actualSizeX: 20,
    actualSizeY: 20},
  "type1" : {
    src: "images/bullet.png",
    sizeX: 70,
    sizeY: 65,
    numX: 14,
    numY: 6,
    actualSizeX: 70,
    actualSizeY: 60},
  "type2" : {
    src: "images/banana.png",
    sizeX: 120,
    sizeY: 120,
    numX: 10,
    numY: 7,
    actualSizeX: 60,
    actualSizeY: 60},
  "tree" : {
    src: "images/tree.png",
    sizeX: 222,
    sizeY: 222,
    numX: 1,
    numY: 1,
    actualSizeX: 450,
    actualSizeY:530,
  },
  "Cow" :{
    src: "images/cow.png",
    sizeX: 237,
    sizeY: 160,
    numX: 8,
    numY: 8,
    actualSizeX: 60,
    actualSizeY:60,
  },
  "Chicken" :{
    src: "images/chicken.png",
    sizeX: 33,
    sizeY: 20,
    numX: 3,
    numY: 1,
    actualSizeX: 60,
    actualSizeY:60,
  }
}
//----------------------------LEVEL DATA-------------------------------------------------------------
level0 = {
  events: [{
    time: 1,
    type: "Cow",
    position: 0
  }, {
    time: 5,
    type: "Cow",
    position: 1
  },{
    time: 8,
    type: "Cow",
    position: 1
  },{
    time: 10,
    type: "Cow",
    position: 2
  },{
    time: 5,
    type: "Chicken",
    position: 3
  },{
    time: 15,
    type: "Cow",
    position: 1
  }, {
    time: 15,
    type: "Cow",
    position: 2
  },{
    time: 20,
    type: "Cow",
    position: 3
  },{
    time: 15,
    type: "Cow",
    position: 1
  },{
    time: 25,
    type: "Chicken",
    position: 0
  },{
    time: 30,
    type: "Chicken",
    position: 2
  },{
    time: 35,
    type: "Cow",
    position: 1
  }, {
    time: 35,
    type: "Cow",
    position: 2
  },{
    time: 35,
    type: "Cow",
    position: 3
  },{
    time: 40,
    type: "Cow",
    position: 0
  },{
    time: 45,
    type: "Chicken",
    position: 1
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
	canvas.width = 0.95*window.innerWidth;
	canvas.height = 0.95*window.innerHeight;
	if (canvas.height/canvas.width>0.6) {
		canvas.height = 0.6*canvas.width;
	}else if (canvas.height/canvas.width<0.6) {
		canvas.width = canvas.height/0.6;
	}
	positionData = {0: {x:0, y:0.75*canvas.height}, 1: {x:0, y:0.25*canvas.height}, 2: {x:canvas.width, y:0.25*canvas.height}, 3: {x:canvas.width, y:0.75*canvas.height}};
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
	game = new gameEngine(level0);
};



//------------------------------GAMEENGINE---------------------------------
gameEngine = Class.extend({
  world: null,
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
	
	startGame: function() {
		document.getElementById("canvas").removeEventListener("mousedown", game.startGame);
		clearInterval(game.interval);
		audio.play("background");
		world = new world(game.file);
		inputManager = new inputManager();
		game.interval = setInterval(game.action, frameRate);
	},
  
  action: function() {
    if (world.isGameOver() && game.over) {
			//render
			renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 999999, 0.46*canvas.width, 0.94*canvas.height, "You Lost!");
			game.over = false;
      audio.stop("background");
      audio.play("gameover");
    }else if (world.isWin()&& game.over) {
			//render
			renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 999999, 0.46*canvas.width, 0.94*canvas.height, "You Win!");
			game.over = false;
      audio.stop("background");
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

//------------------------------RENDERINGENGINE-------------------------------
renderingEngine = Class.extend({
	messages: null,
	string: null,
	
	init: function() {
		this.messages = [];
	},
	
	waitingPage: function() {
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.clearRect(1, 1, canvas.width-2, canvas.height-2);
		ctx.font = (50/1200*canvas.width).toString()+"px Georgia";
		this.string == "Click to start" ? this.string = "" : this.string = "Click to start"
		ctx.fillText(this.string, 0.35*canvas.width, 0.5*canvas.height);
	},
	
	loadingPage: function() {
		//render temporary
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.clearRect(1, 1, canvas.width-2, canvas.height-2);
		ctx.font = (50/1200*canvas.width).toString()+"px Georgia";
		ctx.fillText(renderingEngine.string, 0.4*canvas.width, 0.5*canvas.height);
		renderingEngine.string+='.';
		if (renderingEngine.string.length == 13) renderingEngine.string = "Loading";
	},
	
	createMessage: function(style, duration, x, y, text) {
		this.messages.push(new message(style, duration, x, y, text));
	},
	
	render: function() {
		//render screen: temporary
		ctx.fillRect(0,0,canvas.width, canvas.height);
		ctx.fillRect(0,0.125*canvas.height,canvas.width,0.8125*canvas.height);
    ctx.clearRect(1,0.125*canvas.height+1,canvas.width-2, 0.6875*canvas.height-2);
    ctx.clearRect(1,1,canvas.width-2,0.125*canvas.height-2);
    ctx.clearRect(1,0.8125*canvas.height+1,canvas.width-2, 0.1875*canvas.height-2);
  	ctx.font=(20/1200*canvas.width).toString()+"px Georgia";
  	ctx.fillText("Tree Hp: "+Math.round(world.tree.hp),0.46*canvas.width,0.07*canvas.height);
  	ctx.fillText("Money: "+world.money, moneyDisplay.x, moneyDisplay.y);
		
    //render tree
    world.tree.render.animate();
		
    //render cooldown text: temporary
		ctx.font = (20/1200*canvas.width).toString()+"px Georgia";
		ctx.fillText("CoolDown: "+Math.ceil(world.tree.rotateCoolDown),0.47*canvas.width, 0.105*canvas.height);
		
    //font definition temporary
		ctx.font=(15/1200*canvas.width).toString()+"px Georgia";
		
    //render boxes temporary
		for (var i=0; i<6; i++) {
      ctx.fillRect(world.tree.slots[i].x-slotSize.x, world.tree.slots[i].y-slotSize.y, 2*slotSize.x,2*slotSize.y);
      ctx.clearRect(world.tree.slots[i].x-slotSize.x+1, world.tree.slots[i].y-slotSize.y+1, 2*slotSize.x-2,2*slotSize.y-2);
			
      //render monkey temporary
			if (world.tree.slots[i].monkey) {
				world.tree.slots[i].monkey.render.animate();
				}
		};
		
    //render deployable units temporary
    for (var i=0; i<world.deploy.length; i++) {
			//world.deploy[i].monkey.render.animate();
			ctx.fillRect(world.deploy[i].monkey.x, world.deploy[i].monkey.y, 0.008*canvas.width, 0.008*canvas.width);
			ctx.fillText(world.deploy[i].monkey.type, world.deploy[i].monkey.x-0.016*canvas.width, world.deploy[i].monkey.y +0.04*canvas.height);
			ctx.fillText(characterData.monkeys[world.deploy[i].monkey.type].cost,world.deploy[i].monkey.x, world.deploy[i].monkey.y-0.014*canvas.height);
    }
		
    //render monster temporary
		for (var i=0; i<4; i++) {
			for (var j=0; j<world.objects[i].length; j++) {
				world.objects[i][j].render.animate();
			}
		}
		
    //render bullets
		for (var i=0; i<world.bullets.length; i++) {
			world.bullets[i].render.animate();
		}
		
    //render coins
		for (var i=0; i<world.coins.length; i++) {
			world.coins[i].render.animate();
		}
		
    //render popup messages
		for (var i=0; i<this.messages.length; i++) {
			this.messages[i].render();
		}
		
    //render deploying units temporary
    if(world.buffer) {
			//world.buffer.render.animate();
			ctx.fillRect(world.buffer.x, world.buffer.y, 0.008*canvas.width, 0.008*canvas.width);
		ctx.fillText(world.buffer.type, world.buffer.x-0.016*canvas.width, world.buffer.y +0.04*canvas.height);}
		//render rotating units temporary
		if (world.rotateBuffer.length>0) {
      for (var i=0; i<6; i++) {
        if (world.rotateBuffer[i]) {
					//world.rotateBuffer[i].render.animate();
					ctx.fillRect(world.rotateBuffer[i].x, world.rotateBuffer[i].y, 0.008*canvas.width, 0.008*canvas.width);
		ctx.fillText(world.rotateBuffer[i].type, world.rotateBuffer[i].x-0.016*canvas.width, world.rotateBuffer[i].y +0.04*canvas.height);}
      }
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
	flag: null,
  
  init: function(file) {
    this.script = file;
    this.tree = new tree(this.script.level);
    this.nextTimer = this.script.events[0].time;
    this.bullets = [];
    this.deploy = [];
    this.rotateBuffer = [];
    this.money = startingGold;
		this.coins = [];
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
    audio.play(m.type);
  },
  
  spawnMonkey: function(mon, position) {
    if (this.tree.slots[position].monkey !== null){
      return;
    }else if (characterData.monkeys[mon].cost > this.money) {
			renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 3,  0.46*canvas.width, 0.9*canvas.height, "You Need More Gold");
			return;
		}
    mm = characterData.monkeys[mon];
    m = new monkey(mm.hp, position, mm.damage, mm.attackRate, mm.attackRange, mm.bulletType, mm.cost, mon);
    this.tree.addMonkey(position, m);
    this.money -= mm.cost;
    audio.play("monkeySpawn");
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
				if (list[1].isCollect == false) {
					list[1].isCollect = true;
					list[1].collect();
          audio.play("pickCoin");
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
		for (var i=0; i<this.coins.length; i++) {
			this.coins[i].action();
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
    audio.play("hit"); 
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
  render: null,
	x: null,
	y: null,
  
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
    this.render = new animation(this, "tree");
		this.x = TREE_POSITION_X;
		this.y = TREE_POSITION_Y;
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
    if (this.rotateCoolDown>0) this.decreaseCoolDown();
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
    this.bulletType = bulletType;
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
		this.render = new animation(this,type);
		//temporary
		if (this.render.src == null) {
			this.render.animate = (function() {
				ctx.fillText(this.from.type, this.from.x-0.016*canvas.width, this.from.y-0.014*canvas.height);
				ctx.fillRect(this.from.x, this.from.y, 0.0083*canvas.width,0.0083*canvas.width);
			});
		}
  },
  
  action: function(list) {
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
		var bt = bulletData[this.bulletType];
    var b = new bullet(this.x, this.y, this.damage, bt.v, target, bt.type, this.bulletType);
    audio.play("monkeyShoot");
    return b;
  }
});

monster = armedBeing.extend({
  vx: null,
  moved: false,
  reward: null,
  type: null,
  render:null,

  init: function(hp, x, y, damage, attackRate, attackRange, bulletType, vx, reward, type) {
    this._super(hp, x, y, damage, attackRate, attackRange, bulletType);
    this.vx = vx/1000*frameRate;
    this.reward = reward;
  	this.type = type;
    this.render = new animation(this,type);
		//temporary
		if (this.render.src == null) {
			this.render.animate = (function() {
				ctx.fillText(this.from.type, this.from.x-0.016*canvas.width, this.from.y-0.014*canvas.height);
				ctx.fillRect(this.from.x, this.from.y, 0.0083*canvas.width,0.0083*canvas.width);
			});
		}
  },
  
  action: function(slot) {
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
    this.x += this.vx;
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
		var bt = bulletData[this.bulletType];
    var b = new bullet(this.x, this.y, this.damage, bt.v, slot, bt.type, this.bulletType);
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
	ay: null,
	render: null,
  
  init: function(x, y, damage, v, target, type, name) {
    if (type == "straight") {
      this.action = (function() {
        this.time -= 1;
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
			this.ay = gravity/1000*frameRate/1000*frameRate;
      this.action = (function() {
        this.time -= 1;
        if (this.time<=0) {
          this.attack(this.target);
          this.isDead = true;
        }else {
          this.vy += this.ay;
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
        return [diffx/time, diffy/time - 1/2*this.ay*time, time];
      });
    }
    this.x = x;
    this.y = y;
    var t = this.calculateTrajectory(this, target, v/1000*frameRate);
    this.damage = damage;
    this.vx = t[0];
    this.vy = t[1];
    this.isDead = false;
    this.target = target;
    this.time = t[2];
    this.v = v;
		this.render = new animation(this, name);
		//temporary
		if (this.render.src == null) {
			this.render.animate = (function() {
				ctx.fillRect(this.from.x, this.from.y, 5/1200*canvas.width, 5/1200*canvas.width);
			});
		}
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
	isCollect: false,
	render: null,
	
	init: function(x,y) {
		this.value = 5;
		this.x = x;
		this.y = y;
		this.vx = (Math.random()*100-50)/1000*frameRate;
		this.vy = (-250+ Math.random()*50-25)/1000*frameRate;
		this.ay = gravity/1000*frameRate/1000*frameRate;
		this.time = this.calculateTime();
		this.ax;
		this.render = new animation(this, "coin");
	},
	
	 move: function() {
		 
		this.vy += this.ay;
    this.y += this.vy;
		this.y = Math.min(this.y, SLOTS_POSITION_Y[0]);
		this.x += this.vx;
  },
	
	collect: function() {
		this.vy = 0;
		this.vx = 0;
		var diffx = TREE_POSITION_X-this.x;
		var diffy = TREE_POSITION_Y-this.y;
		hypo = Math.sqrt(diffx*diffx+diffy*diffy);
		var a = coinAcc/1000000*frameRate*frameRate;
		this.ay = a/hypo*diffy;
		this.ax = a/hypo*diffx;
		this.time = Math.sqrt(2*hypo/a);
		this.move = (function() {
			this.vy += this.ay;
			this.vx += this.ax;
			this.y += this.vy;
			this.x += this.vx;
			if (this.time<=0){
				world.money += this.value;
				this.isDead = true;
			}
		});
	},
	
	action: function() {
		if (this.time<=0) return;
		this.time -= 1;
		this.move();
	},
	
	calculateTime: function() {
		return (-1*this.vy+Math.sqrt(this.vy*this.vy+2*this.ay*(SLOTS_POSITION_Y[0]-this.y)))/this.ay;
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
  init: function(){
    this.collections = {};
    for(var key in musicData){
      var context = new Audio();
			context.oncanplaythrough = (function(){game.loaded++;game.checkLoading();});
			context.src = musicData[key].src;
      context.loop = musicData[key].loop;
      context.volume = musicData[key].volume;
      this.collections[key] = context;
    }
  },

  play: function(name){
		if (!this.collections[name].paused) {
			var clone = new Audio(musicData[name].src);
			clone.loop = musicData[name].loop;
			clone.volume = musicData[name].volume;
			clone.play();
		}else this.collections[name].play();
  },

  playMove: function(name){
    this.collections[name].play();
  },

  stop: function(name){
    this.collections[name].pause();
  }

});

imageManager = Class.extend({
	collections: null,

	init: function() {
	
  	this.collections = {};
		for (var key in imageData) {
			var list = [];
			var img = new Image();
			img.onload = (function(){game.loaded++;game.checkLoading();});
			img.src = imageData[key].src;
			var x = 0;
			var y = 0;
			var sx = imageData[key].actualSizeX/1200*canvas.width;
			var sy = imageData[key].actualSizeY/720*canvas.height;
			for (var i=0; i<imageData[key].numY; i++) {
				for (var j=0; j<imageData[key].numX; j++) {
					var inside = [img, x+j*imageData[key].sizeX, y+i*imageData[key].sizeY, imageData[key].sizeX, imageData[key].sizeY, -sx/2, -sy/2, sx, sy];
					list.push(inside);
				}
			}
			this.collections[key] = list;
		}
	},
	
	retrieve: function(name) {
		return this.collections[name];
	}
});

animation = Class.extend({
	frame : 0,
	size : null,
	src : null,
	from: null,
	
	init: function(from, name) {
		this.src = imageManager.retrieve(name);
		//temporary
		if (this.src) {
			this.size = this.src.length;
		}
		
		this.from = from;
	},
	
	animate : function(x, y) {
		var list = this.src[this.frame];
		this.frame = (this.frame+1)%this.size;
		list[5] += this.from.x;
		list[6] += this.from.y;
		ctx.drawImage.apply(ctx,list);
		list[5] -= this.from.x;
		list[6] -= this.from.y;
	}
});

