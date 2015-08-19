//--------------------------------CLASS-------------------------------------------

World = Class.extend({
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
	count: null,
	wave: null,
	bgClass: null,
  score: null,
  upgradeCost: null,
  /*
  init: function(file) {
    this.script = file;
    this.tree = new tree(this.script.level);
    this.nextTimer = this.script.events[0].time;
    this.bullets = [];
    this.deploy = [];
    this.rotateBuffer = [];
    this.money = startingGold;
		this.coins = [];
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
    this.objects = {0: [], 1:[], 2:[], 3:[]};
  },
	*/
	//new data structure
	init: function(levelNum) {
		this.script = levelData[levelNum].events;
		this.nextTimer = this.script[0].time[0];
		this.count = 0;
		this.wave = 0;
		this.tree = new tree(levelData[levelNum].level);
    this.bullets = [];
    this.deploy = [];
    this.rotateBuffer = [];
    this.money = startingGold;
		this.coins = [];
		this.flag = true;
		this.bgClass = new backgroundClass();
    this.score= 0;
    this.upgradeCost = 100;
    for (var i=0; i<levelData[levelNum].deploy.length; i++) {
      this.deploy.push(new slot(null,null));
      var box = this.deploy[i];
      box.x = boxPosition.x+(i*2*slotSize.x);
      box.y = boxPosition.y;
      var m = new dummyMonkey(levelData[levelNum].deploy[i],0);
      m.x = box.x;
      m.y = box.y;
      box.monkey = m;
    }
    this.objects = {0: [], 1:[], 2:[], 3:[]};
  },
	
  
  isGameOver: function() {
    return this.gameOver;
  },
  
  isWin: function() {
    if (!this.isFinish) return false;
    return (this.objects[0].length == 0 && this.objects[1].length == 0  && this.objects[2].length == 0  && this.objects[3].length == 0 );
  },
  
  /*spawn: function(xx) {
    var mon = characterData.monsters[xx.type];
    var m = new monster(mon.hp, positionData[xx.position].x, positionData[xx.position].y, mon.damage,
      mon.attackRate, mon.attackRange, mon.bulletType, ((xx.position)>1 ? -mon.vx: mon.vx), mon.reward, xx.type);
    this.objects[xx.position].push(m);
    audio.play(m.type);
  },
  */
	// new data structure
	spawn: function(type, position) {
		var mon = characterData.monsters[type];
		if (type=="Gorilla") {
			var m = new monster(mon.hp, positionData[position].x
			, positionData[position].y-80/720*canvas.height, mon.damage,
			mon.attackRate, mon.attackRange, mon.bulletType, (position>1 ? -mon.vx: mon.vx), mon.reward, type, mon.point);
		}else{
		var m = new monster(mon.hp, positionData[position].x, positionData[position].y, mon.damage,
			mon.attackRate, mon.attackRange, mon.bulletType, (position>1 ? -mon.vx: mon.vx), mon.reward, type, mon.point);
		}
		this.objects[position].push(m);
		audio.play(type);
	},
	
  spawnMonkey: function(mon, position) {
    if (this.tree.slots[position].monkey !== null){
      return;
    }else if (characterData.monkeys[mon].cost > this.money) {
			renderingEngine.createMessage((50/1200*canvas.width).toString()+"px Georgia", 3,  0.33*canvas.width, 0.93*canvas.height, "You Need More Gold");
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
    for (var i=0; i<4; i++) {
      var m = world.tree.slots[i].monkey;
      if (m && m.isDead) world.tree.slots[i].monkey = null;
    }
		remove(this.coins);
		remove(renderingEngine.messages);
  },

  upgrade: function(){
    if(this.money < this.upgradeCost){
      renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 1,  0.07*canvas.width, 0.03*canvas.height, "You Need More Gold");
      return;
    }else{
			monkeySpeed += 1;
			this.money -= this.upgradeCost;
      this.upgradeCost *= 1.5;
			this.upgradeCost = Math.ceil(this.upgradeCost/10)*10;
      ctx.fillRect(0,0,canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(1,0.125*canvas.height+1,canvas.width-2, 0.6875*canvas.height-1);
			characterData.monkeys["Soldier"].attackRate /= 1.2;
      //characterData.monkeys["Soldier"].hp += 50;
      characterData.monkeys["Soldier"].damage += 50;
      world.tree.hp += 200;
      world.tree.totalHp += 200;
			characterData.monkeys["Soldier"].cost = Math.ceil(characterData.monkeys["Soldier"].cost*1.1/10)*10;
			for (var i=0; i<6; i++) {
				if (this.tree.slots[i].monkey) {
					this.tree.slots[i].monkey.attackRate /= 1.2;
          //this.tree.slots[i].monkey.hp += 200;
          this.tree.slots[i].monkey.damage += 50;
				}
			}
			renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 1, 0.05*canvas.width, 0.03*canvas.height, "Monkeys have been upgraded!");
      renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 1, 0.15*canvas.width, 0.35*canvas.height, "1.2 x Attack Speed!!");
      renderingEngine.createMessage((20/1200*canvas.width).toString()+"px Georgia", 1, 0.75*canvas.width, 0.35*canvas.height, "1.2 x Attack Speed!!");

			
      //Need Help
    }
  },
  
  action: function() {
    list = inputManager.retrieve();
    while (list) {
      if (list[0] == "deploying") {
        if (!this.buffer) {
          this.buffer = new dummyMonkey(list[1].type,0);
        }
        this.buffer.x = list[2];
        this.buffer.y = list[3];
      }
      else if (list[0] == "rotating") {
        if (this.rotateBuffer.length==0) {
          for (var i=0; i<4; i++) {
            var m = world.tree.slots[i].monkey;
            if (m) {
              this.rotateBuffer.push(new dummyMonkey(m.type,i));
              this.rotateBuffer[i].x = m.x;
              this.rotateBuffer[i].y = m.y;
            } else this.rotateBuffer.push(null);
          }
          this.rotateBuffer.push(list[2]);
        }else{
          var diff = (list[2] - this.rotateBuffer[4]+4)%4;
          for (var i=0; i<4; i++) {
            if (this.rotateBuffer[i]) {
              this.rotateBuffer[i].x = SLOTS_POSITION_X[(diff+i)%4];
              this.rotateBuffer[i].y = SLOTS_POSITION_Y[(diff+i)%4];
							this.rotateBuffer[i].slotNumber = (diff+i)%4;
							this.rotateBuffer[i].render.change()
            }
          }
        } 
      }
      else if (list[0] == "deploy") {
        world.spawnMonkey(list[1].type, list[2]);
        this.buffer = null;
      }
      else if (list[0] == "rotate") {
        world.tree.rotateClockwise((list[2] - this.rotateBuffer[4]+4)%4);
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
    this.bgClass.action();
		for (var j=0; j<4; j++) {
      for (var i=0; i<this.objects[j].length; i++) {
        var b = this.objects[j][i].action(this.tree.slots[j]);
        if (b) this.bullets.push(b);
      }
    }
    for (var i=0; i<4; i++) {
      if (this.tree.slots[i].monkey) {
        var b = this.tree.slots[i].monkey.action(world.objects[i]);
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
		//new data structure
		while (!this.isFinish && this.timer >= this.nextTimer && !this.gameOver) {
			if (this.flag) {
				renderingEngine.createMessage((100/1200*canvas.width).toString()+"px Georgia", 3,  0.37*canvas.width, 0.95*canvas.height, "Wave "+(this.wave+1));
				this.flag = false;
			}
			this.spawn(this.script[this.wave].type[this.count], this.script[this.wave].position[this.count]);
		  this.count++;
      if (this.count == this.script[this.wave].time.length) {
			  if (this.wave == this.script.length-1) {
				  this.isFinish = true;
			  }else {
				  this.timer = -this.script[this.wave].wait;
				  this.nextTimer = this.script[this.wave+1].time[0];
			  }
        this.wave++;
				this.count = 0;
				this.flag = true;
      }
      else this.nextTimer = this.script[this.wave].time[this.count];
    }
    this.timer+=frameRate/1000;
  }
});

livingBeing = Class.extend({
  hp: null,
  x: null,
  y: null,
  isDead: null,
	totalHp: null,
  
  init: function(hp, x, y) {
    this.hp = hp;
		this.totalHp = hp;
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
		this.render.hit();
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
		this.render.animate = (function(x, y) {
		var list = this.src[this.frame];
		this.frame = (this.frame+1)%this.size;
		list[5] += this.from.x;
		list[6] += this.from.y;
    //ctx.translate(canvas.width,0);
    //ctx.scale(-1,-1);
		ctx.drawImage.apply(ctx,list);
    //ctx.restore();
		list[5] -= this.from.x;
		list[6] -= this.from.y;
	});
		this.x = TREE_POSITION_X;
		this.y = TREE_POSITION_Y;
		this.type = "coin";
  },
  //todo/discuss: generateHp and generateCoolDown
  
  generateCoolDown: function(level) {
    return 5;
  },
  
  generateHp: function(level) {
    return 2500;
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
    for (var i=0; i<4; i++) {
      s.push(world.tree.slots[(i+4-diff)%4]);
      s[i].x = SLOTS_POSITION_X[i];
      s[i].y = SLOTS_POSITION_Y[i];
      var m = s[i].monkey;
      if (m) {
				m.slotNumber = i
        m.x = SLOTS_POSITION_X[i];
        m.y = SLOTS_POSITION_Y[i];
				m.render.change();
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
	render: null,
	slotNumber: null,
  
  init: function(type, num) {
    this.type = type;
		this.slotNumber = num;
		this.render = new animation(this, type+"Dummy");
		this.render.checkFace = (function() {
			return this.from.slotNumber<2;
		});
		this.render.change();
		if (this.render.src == null) {
			this.render.animate = (function() {
				ctx.fillRect(this.from.x, this.from.y, 0.008*canvas.width, 0.008*canvas.width);
				ctx.fillText(this.from.type, this.from.x-0.016*canvas.width, this.from.y +0.04*canvas.height);
			});
		}
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
    this._super(hp, SLOTS_POSITION_X[slotNumber]+0.005*canvas.width*(slotNumber<3?-1:1), SLOTS_POSITION_Y[slotNumber],
    damage, attackRate, attackRange, bulletType);
    this.slotNumber = slotNumber;
    this.cost = cost;
		this.type = type;
		this.render = new animation(this, type);
		this.render.checkFace = (function() {
			return this.from.slotNumber<2;
		});
		this.render.change();
		this.render.animate = (function(x, y) {
		if (this.timer) {
			if (this.timer < 0) this.timer = null;
			else if (this.time - this.timer <=64 && this.time>this.timer) {
				this.timer -= frameRate;
				return;
			}else if (this.time - this.timer >=0) {
				this.time -= 500;
				this.timer -= frameRate;
			}else this.timer -=frameRate;
		}
		var list = this.src[this.frame];
		this.frame = (this.frame+monkeySpeed)%this.size;
		list[5] += this.from.x;
		list[6] += this.from.y;
    //ctx.translate(canvas.width,0);
    //ctx.scale(-1,-1);
		ctx.drawImage.apply(ctx,list);
    //ctx.restore();
		list[5] -= this.from.x;
		list[6] -= this.from.y;
	});
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
  point:null,
	
	
  init: function(hp, x, y, damage, attackRate, attackRange, bulletType, vx, reward, type, point) {
    this._super(hp, x, y, damage, attackRate, attackRange, bulletType);
    this.vx = vx/1000*frameRate;
    this.reward = reward;
    this.point = point;
  	this.type = type;
		this.render = new animation(this, type);
		this.render.checkFace = (function() {
			return this.from.vx<0;
		});
		this.render.change();
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
		this.render.hit();
    if (this.hp<=0 && !this.isDead){
      this.isDead = true;
      world.score += this.point;
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
		this.render.checkFace = (function() {
			return this.from.vx<0;
		});
		this.render.change();
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
		this.y = Math.min(this.y, floorPosition);
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
		return (-1*this.vy+Math.sqrt(this.vy*this.vy+2*this.ay*(floorPosition-this.y)))/this.ay;
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
		if (this.time <=0 ) this.isDead = true;
		else {
			ctx.font = this.style;
			ctx.fillText(this.m, this.x, this.y);
			this.time -=frameRate/1000;
		}
	}
});

button = Class.extend({
	x: null,
	y: null,
	sx: null,
	sy: null,
	text: null,
	isDead: false,
	style: null,
	xx: null,
	yy: null,
	colour: null,
	
	init: function(style, text, xx, yy, sx, sy, x, y) {
		this.x = x;
		this.y = y;
		this.sx = sx;
		this.sy = sy;
		this.text = text;
		this.xx = xx;
		this.yy = yy;
		this.style = style;
		this.colour = "#FFFF00";
	},
	
	render: function() {
		if (this.isDead) return;
		ctx.fillRect(this.x-this.sx, this.y-this.sy, 2*this.sx, 2*this.sy);
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.x-this.sx+1, this.y-this.sy+1, 2*this.sx-2, 2*this.sy-2);
		ctx.fillStyle = "#000000";
		ctx.font = this.style;
		ctx.fillText(this.text, this.xx, this.yy);
	}
});
		
audioManager = Class.extend({
  collections: null,
	playing: null,
  init: function(){
    this.collections = {};
		this.playing = [];
		this.count = 0;
    for(var key in musicData){
      var context = new Audio();
			context.oncanplaythrough = (function(){game.loaded++;game.checkLoading();});
			context.src = musicData[key].src;
      context.loop = musicData[key].loop;
      context.volume = musicData[key].volume;
      this.collections[key] = context;
    }
  },
	
	reset: function() {
		for (var i=0; i< this.playing.length; i++) {
			this.playing[i].pause();
		}
		this.playing = [];
		this.stopBackground();
	},
		
	remove: function(name) {
		var index = this.playing.indexOf(name);
		this.playing.splice(index,1);
	},
	
	playBackground: function() {
		this.collections["background"].play();
	},
	
  play: function(name){
		var clone = new Audio(musicData[name].src);
		clone.loop = musicData[name].loop;
		clone.volume = musicData[name].volume;
		if (!clone.loop) {
			clone.onended = (function(){
				audio.remove(clone);
			});
		}
		audio.playing.push(clone);
		clone.play();
  },

  playMove: function(name){
    this.collections[name].play();
  },
	
	stopBackground: function() {
		this.collections["background"].pause();
	},
	
	pause: function() {
		for(var i=0; i<this.playing.length; i++) {
			this.playing[i].pause();
		}
	},
	
	resume: function() {
		for(var i=0; i<this.playing.length; i++) {
			this.playing[i].play();
		}
	}
});

ImageManager = Class.extend({
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
      if(key == "Soldier" || key == "Soldier1"||key == "type2"||key =="type21"){
        if (key[key.length-1]=='1') {
          for (var i=0; i<imageData[key].numY; i++) {
            for (var j=imageData[key].numX-1; j>=0; j-=2) {
              var inside = [img, x+j*imageData[key].sizeX, y+i*imageData[key].sizeY, imageData[key].sizeX, imageData[key].sizeY, -sx/2, -sy/2, sx, sy];
              list.push(inside);
            }
          }
        }else {
          for (var i=0; i<imageData[key].numY; i++) {
            for (var j=0; j<imageData[key].numX; j+=2) {
              var inside = [img, x+j*imageData[key].sizeX, y+i*imageData[key].sizeY, imageData[key].sizeX, imageData[key].sizeY, -sx/2, -sy/2, sx, sy];
              list.push(inside);
            }
          }
        }
      }
      else if (key[key.length-1]=='1') {
        for (var i=0; i<imageData[key].numY; i++) {
          for (var j=imageData[key].numX-1; j>=0; j--) {
            var inside = [img, x+j*imageData[key].sizeX, y+i*imageData[key].sizeY, imageData[key].sizeX, imageData[key].sizeY, -sx/2, -sy/2, sx, sy];
            list.push(inside);
          }
        }
      }else {
  			for (var i=0; i<imageData[key].numY; i++) {
	   			for (var j=0; j<imageData[key].numX; j++) {
		  			var inside = [img, x+j*imageData[key].sizeX, y+i*imageData[key].sizeY, imageData[key].sizeX, imageData[key].sizeY, -sx/2, -sy/2, sx, sy];
			   		list.push(inside);
				  }
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
	timer: null,
	time: null,
	leftSrc: null,
	rightSrc: null,
	
	init: function(from, name) {
		this.leftSrc = imageManager.retrieve(name);
		this.rightSrc = imageManager.retrieve(name+"1");
		this.src = this.leftSrc;
		//temporary
		if (this.src) {
			this.size = this.src.length;
		}
		
		this.from = from;
	},
	
	checkFace: function() {return true},
	
	change: function() {
		if (this.checkFace()) {
			this.src = this.leftSrc;
		}else this.src = this.rightSrc;
	},
	/*
	hit: function() {
		if (this.timer !== null) {
			if (this.timer < 3000) {
				this.timer += 1000;
				this.time += 1000;
			}
			return;
		}
		this.timer = 3000;
		this.time = 3000;
	},
	*/
	
	hit: function() {
		this.timer = 64;
		this.time = 65;
	},
	
	animate : function(x, y) {
		if (this.timer) {
			if (this.timer < 0) this.timer = null;
			else if (this.time - this.timer <=64 && this.time>this.timer) {
				this.timer -= frameRate;
				return;
			}else if (this.time - this.timer >=0) {
				this.time -= 500;
				this.timer -= frameRate;
			}else this.timer -=frameRate;
		}
		var list = this.src[this.frame];
		this.frame = (this.frame+1)%this.size;
		list[5] += this.from.x;
		list[6] += this.from.y;
    //ctx.translate(canvas.width,0);
    //ctx.scale(-1,-1);
		ctx.drawImage.apply(ctx,list);
    //ctx.restore();
		list[5] -= this.from.x;
		list[6] -= this.from.y;
	}
});

backgroundClass = Class.extend({
  cloud : null,
  grass : null,
	
	init : function() {
		this.cloud = [];
		this.grass = [];
	},
	
	createCloud : function() {
		var c = new cloud(Math.ceil(Math.random()*numCloud));
		var count =0;
		while (count<this.cloud.length) {
			if (this.cloud[count].size > c.size) break;
			count++;
		}
		this.cloud.splice(count,0,c);
	},
	
	createGrassLand: function() {},
	
	animate: function() {
		for (var i=0; i<this.cloud.length; i++) {
			this.cloud[i].render.animate();
		}
		/*
		for (var i=0; i<this.grass.length; i++) {
			this.grass[i].render.animate();
		}
		*/
	},
	
	action: function() {
		if (this.cloud.length<10) Math.random()>0.995 ? this.createCloud():null;
		for (var i=0; i<this.cloud.length; i++) {
			this.cloud[i].move();
		}
	}
});

cloud = Class.extend({
	x: null,
	y: null,
	vx: null,
	render: null,
	size: null,
	time: null,
	
	init: function(type) {
		this.size = type;
		this.render = new animation(this, "Cloud"+type);
		this.x = Math.random()>0.5 ? positionData[0].x : positionData[2].x;
		this.y = (Math.random()*0.4+0.125)*canvas.height;
		this.vx = (Math.random()*0.00025+0.00025)/(numCloud-type+1)*canvas.width*(this.x>0 ? -1: 1);
		this.time = Math.abs(1.2*canvas.width/this.vx);
	},
	
	move: function() {
		this.x += this.vx;
		this.time -= 1;
		if (this.time<0) {
			var i = world.bgClass.cloud.indexOf(this);
			world.bgClass.cloud.splice(i,1);
		}
	}
});
