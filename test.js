//---------------------------------------VARIABLES-------------------------------------
var canvas = null;
var ctx = null;
var image = null;
var frameRate = 16.6; //todo
var characterData = null;
var bulletData = null;
var positionData = {0: {x:0, y:540}, 1: {x:0, y:180}, 2: {x:1200, y:180}, 3: {x:1200, y:540}};
var world = null;
var inputManager = null;
var game = null;
var gravity = 900;
var boxPosition = {x: 35, y:45};
var TREE_POSITION_X = 590;
var TREE_POSITION_Y = 360;
var SLOTS_POSITION_X = [500,500,500,700,700,700];
var SLOTS_POSITION_Y = [540,360,180,180,360,540];
var slotSize = {
  x : 25,
  y: 35
};
var MONEY_POSITION = [900,700];
//----------------------------------------GAMEDATA-----------------------------------------------------------
//---------------------------------------CHARACTER DATA-----------------------------------------------------
var data = {
<<<<<<< HEAD
  monkeys: {
    "soldier": {
      hp: 500,
      damage: 30,
      attackRate: 1,
      attackRange: 300,
      bulletType: "type1",
      cost: 50
    },
    "archer": {
      hp: 300,
      damage: 50,
      attackRate: 0.5,
      attackRange: 600,
      bulletType: "type1",
      cost: 80
    }
    //...
  },
  
  monsters: {
    "gorilla": {
      hp: 200,
      damage: 20,
      attackRate: 0.8,
      attackRange: 200,
      bulletType: "type1",
      vx: 70,
      reward: 15
    }, 
    "kingkong": {
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
>>>>>>> origin/master
}
//---------------------------BULLET DATA--------------------------------
var bulletData= {
<<<<<<< HEAD
	"type1": {
		v : 240,
		type : "projectile"
	},
	"type2": {
		v: 500,
		type : "projectile"
	}
>>>>>>> origin/master
}
//----------------------------LEVEL DATA-------------------------------------------------------------
level0 = {
<<<<<<< HEAD
  events: [{
    time: 1,
    type: "gorilla",
    position: 0
  }, {
    time: 1,
    type: "gorilla",
    position: 1
  },{
    time: 1,
    type: "gorilla",
    position: 1
  },{
    time: 1,
    type: "gorilla",
    position: 2
  },{
    time: 5,
    type: "kingkong",
    position: 3
  }
    
    
    ],
  level: 1,
  deployNumber: 2,
  deploy: ["soldier", "archer"]

>>>>>>> origin/master
}
//------------------------------MAIN-------------------------------------
var setup = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  //canvas.width = document.body.clientWidth;
  //canvas.height = document.body.clientHeight;
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
  
  init: function(file) {
    world = new world(file);
    //this.renderingEngine = new renderingEngine(world);
    inputManager = new inputManager();
    this.interval = setInterval(this.action, frameRate);
  },
  
  action: function() {
    ctx.clearRect(1,91,canvas.width-2, canvas.height-227);
    ctx.clearRect(1,1,1198,88);
    ctx.clearRect(1,586,canvas.width-2, 133);
    world.action();
    //renderingEngine.render();
    if (world.isGameOver()) {
      world.bullets = [];
      world.buffer = null;
      world.rotateBuffer = [];
      clearInterval(game.interval);
      ctx.clearRect(1,91,canvas.width-2, canvas.height-227);
      ctx.clearRect(1,586,canvas.width-2, 133);
      ctx.clearRect(1,1,1198,88);
      world.action();
      game.gameOverScreen();
    }else if (world.isWin()) {
      world.bullets = [];
      world.buffer = null;
      world.rotateBuffer = [];
      clearInterval(game.interval);
      ctx.clearRect(1,91,canvas.width-2, canvas.height-227);
      ctx.clearRect(1,586,canvas.width-2, 133);
      ctx.clearRect(1,1,1198,88);
      world.action();
      game.winScreen();
    }
  },
  
  gameOverScreen: function() {
    ctx.font = "bold 16px Arial";
    ctx.fillText("LOSER", 600, 0);
    console.log('lose','time taken',world.timer);//todo: specify what to do when game is over
  },
  
  winScreen: function() {console.log('win')}
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
    document.getElementById("canvas").addEventListener("mouseover", this.mouseOver);
  },
  
  retrieve: function() {
    if (this.store.length == 0) return null;
    var x = this.store[0];
    this.store.splice(0,1);
    return x;
  },
  
  mouseDown: function(event) {
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
          return;
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
  },
  
  mouseMove: function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
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
  
  init: function(file) {
    this.script = file;
    this.tree = new tree(this.script.level);
    this.nextTimer = this.script.events[0].time;
    this.bullets = [];
    this.deploy = [];
    this.rotateBuffer = [];
    this.money = 500;
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
      mon.attackRate, mon.attackRange, mon.bulletType, ((xx.position)>1 ? -mon.vx: mon.vx), mon.reward);
    this.objects[xx.position].push(m);
  },
  
  spawnMonkey: function(mon, position) {
    if (this.tree.slots[position].monkey !== null || characterData.monkeys[mon].cost > this.money){
      return false;
    }
    mm = characterData.monkeys[mon];
    m = new monkey(mm.hp, position, mm.damage, mm.attackRate, mm.attackRange, mm.bulletType, mm.cost);
    this.tree.addMonkey(position, m);
    this.money -= mm.cost;
    //console.log(this.money);
 
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
    for (var i=0; i<6; i++) {
      var m = world.tree.slots[i].monkey;
      if (m && m.isDead) world.tree.slots[i].monkey = null;
    }
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
              this.rotateBuffer.push(new dummyMonkey(null));
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
      list = inputManager.retrieve();
    }
    for (var j=0; j<4; j++) {
      for (var i=0; i<this.objects[j].length; i++) {
        var b = this.objects[j][i].action(this.tree.slots[Math.floor(j*1.5 + 0.5)]);
        if (b) this.bullets.push(b);
      }
    }
    for (var i=0; i<6; i++) {
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
    for (var i=0; i<this.deploy.length; i++) {
      this.deploy[i].monkey.action();
    }
    if(this.buffer) {
      this.buffer.action();
    }
    if (this.rotateBuffer.length>0) {
      for (var i=0; i<6; i++) {
        if (this.rotateBuffer[i]) {
          this.rotateBuffer[i].action();
        }
      }
    }
    this.removeDead();
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
    this.hp -= amt;
    if (this.hp<=0){
      this.isDead = true;

    } 
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
    this.coolDownRate = 1;//this.generateCoolDownRate(level);
  },
  //todo/discuss: generateHp and generateCoolDown
  
  generateCoolDown: function(level) {
    return 1;
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
    ctx.fillRect(this.x,this.y,20,20);
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
  
  action: function() {
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
<<<<<<< HEAD
  slotNumber :null,
  
  init: function(hp, slotNumber, damage, attackRate, attackRange, bulletType, cost) {
    this._super(hp, SLOTS_POSITION_X[slotNumber], SLOTS_POSITION_Y[slotNumber],
    damage, attackRate, attackRange, bulletType);
    this.slotNumber = slotNumber;
    this.cost = cost;
  },
  
  action: function(list) {
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
    return b;
  }
>>>>>>> origin/master
});

monster = armedBeing.extend({
<<<<<<< HEAD
  vx: null,
  moved: false,
  
  init: function(hp, x, y, damage, attackRate, attackRange, bulletType, vx, reward) {
    this._super(hp, x, y, damage, attackRate, attackRange, bulletType);
    this.vx = vx;
    this.reward = reward;
  },
  
  action: function(slot) {
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
    if (this.hp<=0){
      this.isDead = true;
      //money += this.reward;
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
  
>>>>>>> origin/master
});

bullet = Class.extend({
<<<<<<< HEAD
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
  
>>>>>>> origin/master
});

  
  
          
  
