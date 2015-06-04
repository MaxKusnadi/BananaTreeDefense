var canvas = null;
var ctx = null;
var image = null;

var setup = function() {
	canvas = document.getElementById("canvas");
	
	ctx = canvas.getContext("2d");
	
	image = new Image();
	image.onload = onloadImage;
	image.src = "./images/Banana_Tree.png";
	
}

var onloadImage = function() {
	console.log("loaded");
	ctx.drawImage(image,0,0);
}