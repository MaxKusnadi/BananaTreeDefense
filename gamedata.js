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
  "type11" : {
    src: "images/bullet1.png",
    sizeX: 70,
    sizeY: 65,
    numX: 14,
    numY: 6,
    actualSizeX: 70,
    actualSizeY: 60},
  "type2" : {
    src: "images/newbanana.png",
    sizeX: 120,
    sizeY: 120,
    numX: 10,
    numY: 6,
    actualSizeX: 60,
    actualSizeY: 60},
  "type21" : {
    src: "images/newbanana1.png",
    sizeX: 120,
    sizeY: 120,
    numX: 10,
    numY: 6,
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
    sizeY: 159,
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
  },
  "Cow1" :{
    src: "images/cow1.png",
    sizeX: 237,
    sizeY: 159,
    numX: 8,
    numY: 8,
    actualSizeX: 60,
    actualSizeY:60,
  },
  "Chicken1" :{
    src: "images/chicken1.png",
    sizeX: 33,
    sizeY: 20,
    numX: 3,
    numY: 1,
    actualSizeX: 60,
    actualSizeY:60,
  },
	"Cloud2" : {
		src: "images/cloud1.png",
		sizeX:857,
		sizeY: 646,
		numX: 1,
		numY: 1,
		actualSizeX: 150,
		actualSizeY: 113,
	},
	"Cloud1" : {
		src: "images/cloud1.png",
		sizeX:857,
		sizeY: 646,
		numX: 1,
		numY: 1,
		actualSizeX: 75,
		actualSizeY: 56,
	}
}
//----------------------------LEVEL DATA-------------------------------------------------------------
/*
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
  }],
  level: 1,
  deployNumber: 2,
  deploy: ["Soldier", "Archer"]

}
*/
levelData = {
	1:{events:[	{time:[1, 5, 8, 10, 12, 15, 15, 20, 15, 25, 30, 35, 35, 35, 40, 45], 
							type:["Cow", "Cow", "Cow", "Cow", "Chicken", "Cow", "Cow", "Cow", "Cow", "Chicken", "Chicken", "Cow", "Cow", "Cow", "Cow", "Chicken"], 
							position:[0, 1, 1, 2, 3, 1, 2, 3, 1,0, 2, 1, 2, 3, 0, 1],
							wait:10},
							
							{time:[1,1,1,1],
							type:["Chicken","Chicken","Chicken","Chicken"],
							position:[0,1,2,3]}],
		level: 1,
		deploy: ["Soldier", "Archer"]},
	2:{}
}
