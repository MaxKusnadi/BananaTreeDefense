var TREE_POSITION_X = 0;
var TREE_POSITION_Y = 0;
var SLOTS_POSITION_X = [0,0,0,0,0,0];
var SLOTS_POSITION_Y = [0,0,0,0,0,0];

livingBeing = Class.extend({
	var hp: null;
	var x: null;
	var y: null;
	var isDead: null;
	
	init: function(hp, x, y) {
		this._super();
		this.hp = hp;
		this.x = x;
		this.y = y;
		this.isDead = false;
	}
	
	reduceHp: function(amt) {
		hp -= amt;
		if (hp<=0) isDead = true;
	}
	
	recoverHp: function(amt) {
		hp += amt;
	}
	
	action: function() {}
});

//trees have level and depending on level, the hit point is different?
tree = livingBeing.extend({
	var slots: [];
	var rotateCoolDown: null;
	var coolDownLength: null;
	var coolDownRate: null;
	
	init: function(level) {
		this._super(generateHp(level), TREE_POSITION_X, TREE_POSITION_Y);
		this.slots = [null, null, null, null, null, null];
		this.rotateCoolDown = 0;
		this.coolDownLength = generateCoolDown(level);
		this.coolDownRate = generateCoolDownRate(level);
	}
	//todo/discuss: generateHp and generateCoolDown
	
	addMonkey: function(slotNumber, monkey) {
		//check whether it is occupied
		if (slots[slotNumber]) return;
		this.slots[slotNumber] = monkey;
	}
	
	removeMonkey: function(slotNumber) {
		this.slots[slotNumber] = null;
	}
	
	rotateClockwise: function() {
		if (this.rotateCoolDown>0) return;
		for (var i=1; i<6; i++) {
			var temp = slots[i];
			slots[i] = slots[0];
			slots[0] = temp;
		}
		resetCooldown();
	}
	
	rotateAnticlockwise: function() {
		if (this.rotateCoolDown>0) return;
		for (var i=5; i>0; i--) {
			var temp = slots[i];
			slots[i] = slots[0]'
			slots[0] = temp;
		}
		resetCooldown();
	}
	
	resetCooldown: function() {
		rotateCoolDown = coolDownLength;
	}
	
	action: function() {
		decreaseCoolDown();
	}
	
	decreaseCoolDown: function() {
		if (rotateCoolDown == 0) return;
		rotateCoolDown = Math.max(0, rotateCoolDown - coolDownRate);
	}
});

armedBeing = livingBeing.extend({
	var damage = null;
	var attackRate = null;
	var facingRight = null;
	var attackRange = null;
	
	init: function(hp, x, y, damage, attackRate, attackRange, facingRight) {
		this._super(hp, x, y);
		this.damage = damage;
		this.attackRate = attackRate;
		this.attackRange = attackRange;
		this.facingRight = facingRight;
	}
	
	//todo:
	getTarget: function() {}
	
	//todo: 
	attack: function(target) {}
		//create a bullet object
		//but calculating the projectile is a problem
		//especially when the target might be moving
	
});



monkey = armedBeing.extend({
	var slotNumber = null;
	
	init: function(hp, slotNumber, damage, attackRate, 
	attackRange, facingRight) {
		this._super(hp, SLOTS_POSITION_X[slotNumber], SLOTS_POSITION_Y[slotNumber],
		damage, attackRate, attackRange, facingRight);
		this.slotNumber = slotNumber;
	}
	
	action: function() {
		var target = getTarget();
		if (target) {
			attack(target);
		}
	}
});

monster = armedBeing.extend({
	var vx: null;
	
	init: function(hp, x, y, damage, attackRate, attackRange, facingRight, vx) {
		this.super(hp, x, y, damage, attackRate, attackRange, facingRight);
		this.vx = vx;
	}
	
	action: function() {
		var target = getTarget();
		if (target) {
			attack(target);
		} else {
			move();
		}
	}
	
	move: function() {
		this.x += vx;
});

bullet = Class.extend({
	var x: null;
	var y: null;
	var vx: null;
	var vy: null;
	var damage: null;
	var isDead: null;
	var target: null;
	
	init: function(x, y, damage, vx, vy, target) {
		this.x = x;
		this.y = y;
		this.damage = damage;
		this.vx = vx;
		this.vy = vy;
		this.isDead = false;
		this.target = target;
	}
	
	//redesign this
	action: function() {
		if (hit()) {
			attack(target);
			destroy();
		}
		else move();
	}
	
	hit: function() {
		return this.x = target.x && this.y = target.y;
	}
	
	attack: function(target) {
		target.reduceHp(damage);
	}
	
	move: function() {
		x += vx;
		y += vy;
});