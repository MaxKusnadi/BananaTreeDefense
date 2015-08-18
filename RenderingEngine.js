//------------------------------RENDERINGENGINE-------------------------------
RenderingEngine = Class.extend({
	messages: null,
	string: null,
	buttons: null,
	gradient: null,
	number: null,
	diff: null,
	interval: null,
	
	init: function() {
		this.messages = [];
		this.buttons = {};
		this.number = 0;
		this.gradient = ctx.createLinearGradient(1,0.8125*canvas.height,1, canvas.height-1);
		this.gradient.addColorStop(0,"#D2691E");
		this.gradient.addColorStop(1,"#A52A2A");
		
	},
	
	waitingPage: function() {
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.clearRect(1, 1, canvas.width-2, canvas.height-2);
		ctx.font = (50/1200*canvas.width).toString()+"px Georgia";

		this.string == "Click to start" ? this.string = "" : this.string = "Click to start"
		ctx.fillText(this.string, 0.35*canvas.width, 0.9*canvas.height);
		ctx.fillText("Instruction :", 0.35*canvas.width, 0.2*canvas.height);
		ctx.fillText("1. Defend the tree from the incoming", 0.15*canvas.width, 0.3*canvas.height);
		ctx.fillText("     hordes of wild animals", 0.15*canvas.width, 0.4*canvas.height);
		ctx.fillText("2. Drag and deploy armies of monkey", 0.15*canvas.width, 0.5*canvas.height);
		ctx.fillText("     from top left hand corner to the", 0.15*canvas.width, 0.6*canvas.height);
		ctx.fillText("     6 given boxes", 0.15*canvas.width, 0.7*canvas.height);
		ctx.fillText("3. Enjoy", 0.15*canvas.width, 0.8*canvas.height);
	},
	
	loadingPage: function() {
		//render temporary
		clearInterval(renderingEngine.interval);
		renderingEngine.number = Math.round(renderingEngine.number);
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.clearRect(1, 1, canvas.width-2, canvas.height-2);
		ctx.font = (50/1200*canvas.width).toString()+"px Georgia";
		ctx.fillText(renderingEngine.string, 0.4*canvas.width, 0.5*canvas.height);
		var number = Math.round(game.loaded/numberToLoad*100);
		renderingEngine.diff = (number-renderingEngine.number)/30;
		renderingEngine.interval = setInterval(function() {ctx.clearRect(0.45*canvas.width,0.52*canvas.height, 0.1*canvas.width, 0.1*canvas.height);
			ctx.fillText(Math.round(renderingEngine.number)+"%", 0.45*canvas.width, 0.6*canvas.height);
			renderingEngine.number += renderingEngine.diff;}, frameRate*2);
		ctx.fillText(Math.round(game.loaded/numberToLoad*100)+"%", 0.45*canvas.width, 0.6*canvas.height);
		renderingEngine.string+='.';
		if (renderingEngine.string.length == 13) renderingEngine.string = "Loading";
	},
	
	createMessage: function(style, duration, x, y, text) {
		this.messages.push(new message(style, duration, x, y, text));
	},
	
	createButton: function(key, style, text, xx, yy, sx, sy, x, y) {
		this.buttons[key] = new button(style, text, xx, yy, sx, sy, x, y);
	},
	
	render: function() {
		//render screen: temporary

		ctx.fillRect(0,0,canvas.width, canvas.height);
		ctx.fillStyle = "#00FFFF";
		ctx.fillRect(1,0.125*canvas.height+1,canvas.width-2, 0.6875*canvas.height-1);
		ctx.fillStyle = this.gradient;
		ctx.fillRect(1,0.8125*canvas.height,canvas.width-2, 0.1875*canvas.height-2);
		ctx.fillStyle = "#000000";
    //ctx.fillStyle = "#19A3FF";
    


    //render cooldown text: temporary
    ctx.font = (20/1200*canvas.width).toString()+"px Georgia";
    ctx.fillText("CoolDown: "+Math.ceil(world.tree.rotateCoolDown),0.47*canvas.width, 0.105*canvas.height);



    //font definition temporary
    ctx.font=(15/1200*canvas.width).toString()+"px Georgia";

    world.bgClass.animate();

    //render coins
    for (var i=0; i<world.coins.length; i++) {
    	world.coins[i].render.animate();
    }


    //render tree
    world.tree.render.animate();

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

		//render tree hp bar
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fillRect((0.50-world.tree.totalHp*0.0002/2)*canvas.width,0.13*canvas.height,world.tree.totalHp*0.0002*canvas.width,0.02*canvas.height);
		ctx.fillStyle = "rgb(0,255,0)";
		ctx.fillRect((0.50-world.tree.totalHp*0.0002/2)*canvas.width,0.13*canvas.height,world.tree.hp*0.0002*canvas.width,0.02*canvas.height);
		ctx.fillStyle = "#000000";
		
		ctx.fillRect(0,0,canvas.width, 0.125*canvas.height);
		ctx.clearRect(1,1,canvas.width-2,0.125*canvas.height-2);
		ctx.font=(20/1200*canvas.width).toString()+"px Georgia";
		ctx.fillText("Tree Hp: "+Math.round(world.tree.hp),0.46*canvas.width,0.08*canvas.height);
		ctx.fillText("Score: "+world.score,0.46*canvas.width,0.11*canvas.height);
		ctx.fillText("Money: "+world.money, moneyDisplay.x, moneyDisplay.y);
		ctx.fillText("Upgrade cost: "+world.upgradeCost, 0.20*canvas.width, 0.08*canvas.height);

		for (key in this.buttons) {
			this.buttons[key].render();
		}
		  //render boxes temporary
		  ctx.font = (15/1200*canvas.width).toString()+"px Georgia";
		  for (var i=0; i<6; i++) {
		  	ctx.fillRect(world.tree.slots[i].x-slotSize.x, world.tree.slots[i].y-slotSize.y, 2*slotSize.x,2*slotSize.y);
		  	ctx.clearRect(world.tree.slots[i].x-slotSize.x+1, world.tree.slots[i].y-slotSize.y+1, 2*slotSize.x-2,2*slotSize.y-2);

			//render monkey
			if (world.tree.slots[i].monkey) {
				world.tree.slots[i].monkey.render.animate();
			}
		};
		
    //render deployable units (cost temporary)

    for (var i=0; i<world.deploy.length; i++) {
    	world.deploy[i].monkey.render.animate();
    	ctx.fillText(characterData.monkeys[world.deploy[i].monkey.type].cost,world.deploy[i].monkey.x, world.deploy[i].monkey.y-0.014*canvas.height);
    }


    //render deploying units 
    if(world.buffer) {
    	world.buffer.render.animate();
    }

		//render rotating units
		if (world.rotateBuffer.length>0) {
			for (var i=0; i<6; i++) {
				if (world.rotateBuffer[i]) {
					world.rotateBuffer[i].render.animate();
				}
			}
		}
		
		
    //render popup messages
    for (var i=0; i<this.messages.length; i++) {
    	this.messages[i].render();
    }

}
});