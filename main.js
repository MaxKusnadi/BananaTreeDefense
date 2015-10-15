  //---------------------------------------VARIABLES-------------------------------------
var developerMode = false;
var canvas = null;
var ctx = null;
var image = null;
var frameRate = 40;
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
var pauseResumeButton = null;
var restartButton = null;
var upgradeButton = null;
var floorPostion = null;
var numCloud = null;
var scoreDisplay = null;
var monkeySpeed = 1;

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
	positionData = {0: {x:0, y:0.78*canvas.height}, 1: {x:0, y:0.25*canvas.height}, 2: {x:canvas.width, y:0.25*canvas.height}, 3: {x:canvas.width, y:0.78*canvas.height}};
  floorPosition = positionData[0].y + 0.025*canvas.height;
	boxPosition = {x: 0.03*canvas.width, y:0.0625*canvas.height};
	TREE_POSITION_X = 0.5*canvas.width;
	TREE_POSITION_Y = 0.5*canvas.height;
	SLOTS_POSITION_X = [0.4*canvas.width,0.4*canvas.width,0.6*canvas.width,0.6*canvas.width];
	SLOTS_POSITION_Y = [0.75*canvas.height,0.25*canvas.height,0.25*canvas.height,0.75*canvas.height];
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
	pauseResumeButton = {x:0.90*canvas.width, y: 0.07*canvas.height, sx: 0.04*canvas.width, sy: 0.03*canvas.height};
	restartButton = {x:0.40*canvas.width, y: 0.07*canvas.height, sx: 0.03*canvas.width, sy: 0.03*canvas.height};
	upgradeButton = {x:0.15*canvas.width, y: 0.07*canvas.height, sx: 0.04*canvas.width, sy: 0.03*canvas.height};
	numCloud = 2;
	scoreDisplay = {x:0.30*canvas.width, y: 0.07*canvas.height, sx: 0.03*canvas.width, sy: 0.03*canvas.height};
	//game = new gameEngine(level0);
	//new data structure
	game = new gameEngine(1);
};
