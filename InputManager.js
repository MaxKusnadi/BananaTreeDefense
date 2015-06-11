slotSize.x = 0;
slotSize.y = 0;

inputManager = Class.extend({
	world: null,
	store: null,
	deploying: null,
	
	init: function(world) {
		this.world = world;
		this.store = [];
		document.getElementById("canvas").addEventListener("mousedown", this.mouseDown);
		document.getElementById("canvas").addEventListener("mousemove", this.mouseMove);
		document.getElementById("canvas").addEventListener("mouseup", this.mouseUp);
	},
	
	retrieve: function() {
		if (store.length == 0) return null;
		var x = store[0];
		store.splice(0,1);
		return x;
	},
	
	mouseDown: function(event) {
		var x = event.clientX;
		var y = event.clientY;
		if (deploying) {
			store.push(["deploying", deploying, x, y]);
		}else if(rotating) {
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
			store.push(["rotating", nearest]);
		}else {
			for (var i=0; i<6; i++) {
				var slot = world.tree.slots[i];
				if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
					if (slot.monkey) {
						rotating = slot.monkey;
						return;
					}
				}
			}
			for (var i=0; i<world.deploy.length; i++) {
				var slot = world.deploy[i];
				if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
					deploying = slot.monkey;
					return;
				}
			}
		}
	},
	
	mouseUp: function(event) {
		var x = event.clientX;
		var y = event.clientY;
		if (deploying) {
			for (var i=0; i<6; i++) {
				var slot = world.tree.slots[i];
				if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
					store.push(["deploy", deploying, i]);
					break;
				}
			}
			deploying = null;
		}else if (rotating) {
			for (var i=0; i<6; i++) {
				var slot = world.tree.slots[i];
				if (Math.abs(slot.x-x)<=slotSize.x && Math.abs(slot.y-y)<=slotSize.y) {
					store.push(["rotate", rotating, i]);
					break;
				}
			}
			rotating = null;
		}
	},
	
	mouseMove: function() {}
});
	
	
	
					
	