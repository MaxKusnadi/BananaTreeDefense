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
		this._super();
		this.hp = hp;
		this.x = x;
		this.y = y;
		this.isDead = false;
	},
	
	reduceHp: function(amt) {
		hp -= amt;
		if (hp<=0) isDead = true;
	},
	
	recoverHp: function(amt) {
		hp += amt;
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
		this._super(generateHp(level), TREE_POSITION_X, TREE_POSITION_Y);
		this.slots = [new slot(this), new slot(this), new slot(this), new slot(this), new slot(this), new slot(this)];
		for (var i=0; i<6; i++) {
			slots[i].x = TREE_POSITION_X[i];
			slots[i].y = TREE_POSITION_Y[i];
		}
		this.rotateCoolDown = 0;
		this.coolDownLength = generateCoolDown(level);
		this.coolDownRate = generateCoolDownRate(level);
	},
	//todo/discuss: generateHp and generateCoolDown
	
	addMonkey: function(slotNumber, monkey) {
		//check whether it is occupied
		if (slots[slotNumber].isOccupied()) return;
		this.slots[slotNumber].insertMonkey(monkey);
	},
	
	removeMonkey: function(slotNumber) {
		this.slots[slotNumber].insertMonkey(null);
	},
	
	rotateClockwise: function() {
		if (this.rotateCoolDown>0) return;
		for (var i=1; i<6; i++) {
			var temp = slots[i].monkey;
			slots[i].monkey = slots[0].monkey;
			slots[0].monkey = temp;
		}
		resetCooldown();
	},
	
	rotateAnticlockwise: function() {
		if (this.rotateCoolDown>0) return;
		for (var i=5; i>0; i--) {
			var temp = slots[i].monkey;
			slots[i].monkey = slots[0].monkey;
			slots[0].monkey = temp;
		}
		resetCooldown();
	},
	
	resetCooldown: function() {
		rotateCoolDown = coolDownLength;
	},
	
	action: function() {
		if (rotateCoolDown>0) decreaseCoolDown();
		for (var i=0; i<6; i++) {
			if (slots[i]) slots[i].action();
		}
	},
	
	decreaseCoolDown: function() {
		if (rotateCoolDown == 0) return;
		rotateCoolDown = Math.max(0, rotateCoolDown - coolDownRate);
	}
});

slot = Class.extend({
	tree: null,
	monkey : null,
	x: null,
	y: null,
	
	init: function(tree, x, y) {
		this.tree = tree;
	},
	
	reduceHp : function(damage) {
		if (monkey) monkey.reduceHp(damage);
		else tree.reduceHp(damage);
	},
	
	insertMonkey: function(monkey) {
		this.monkey = monkey;
	},
	
	isOccupied: function() {
		return monkey!==null;
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
		if (coolDown>0) coolDown -= frameRate;
		var target = getTarget(list);
		if (target) {
			return attack(target);
		}
		return null;
	},
	
	getTarget: function(list) {
		var result = null;
		var curr = 100; //todo
		for (var i=0; i<list.length(); i++) {
			var diff = Math.abs(list[i].x = this.x);
			if (diff <= attackRange && diff < curr) {
				curr = diff;
				result = list[i];
			}
		}
		return result;
	},
	
	attack: function(target) {
		if (coolDown>0) return null;
		coolDown = attackRate;
		t = calculateTrajectory(this, target, bulletType.v);
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
		this.super(hp, x, y, damage, attackRate, attackRange, bulletType);
		this.vx = vx;
	},
	
	action: function(slot) {
		if (coolDown>0) coolDown -= frameRate;
		var target = getTarget(slot);
		if (target) {
			return attack(target);
		} else {
			move();
			return null;
		}
	},
	
	move: function() {
		this.x += vx;
	},
	
	getTarget: function(slot) {
		if (Math.abs(this.x - slot.x)<=attackRange) {
			return slot;
		}
		return null;
	},
	
	attack: function(slot) {
		if (coolDown>0) return null;
		coolDown = attackRate;
		t = calculateTrajectory(this, target, bulletType.v);
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
		if (time<=0) {
			attack(target);
			isDead = true;
		}
		else move();
	},
	
	attack: function(target) {
		target.reduceHp(damage);
	},
	
	move: function() {
		time -= frameRate;
		x += vx;
		y += vy;
	}
	
});