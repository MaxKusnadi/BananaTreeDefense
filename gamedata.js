//----------------------------------------GAMEDATA-----------------------------------------------------------

//---------------------------------------CHARACTER DATA-----------------------------------------------------
var data = {
  monkeys: {
    "Soldier": {
      hp: 800,
      damage: 70,
      attackRate: 0.6,
      attackRange: 400,
      bulletType: "type2",
      cost: 70
    },
    // "Archer": {
    //   hp: 550,
    //   damage:70,
    //   attackRate: 0.6,
    //   attackRange: 400,
    //   bulletType: "type2",
    //   cost: 80
    // }
    //...
  },
  
  monsters: {
    "Cow": {
      hp: 350,
      damage: 43,
      attackRate: 0.8,
      attackRange: 300,
      bulletType: "type1",
      vx: 70,
      reward: 25,
      point: 100
    }, 
    "Chicken": {
      hp: 500,
      damage: 40,
      attackRate: 1.8,
      attackRange: 275,
      bulletType: "type1",
      vx: 50,
      reward: 30,
      point: 100
    },
    "Skeleton": {
      hp: 800,
      damage: 40,
      attackRate: 0.5,
      attackRange: 330,
      bulletType: "spell",
      vx: 30,
      reward: 40,
      point: 150
    }, 
    "Spider": {
      hp: 350,
      damage: 30,
      attackRate: 0.2,
      attackRange: 100,
      bulletType: "spell",
      vx: 180,
      reward: 50,
      point: 75
    },
    "Snail": {
      hp: 2000,
      damage: 60,
      attackRate: 2,
      attackRange: 150,
      bulletType: "spell",
      vx: 50,
      reward: 60,
      point: 200
    }, 
    "Zombie": {
      hp: 900,
      damage: 60,
      attackRate: 1.2,
      attackRange: 300,
      bulletType: "spell",
      vx: 45,
      reward: 65,
      point: 150
    },
    "Gorilla": {
      hp: 25000,
      damage: 240,
      attackRate: 3,
      attackRange: 200,
      bulletType: "banana",
      vx: 10,
      reward: 0,
      point: 15000
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
	},
	"spell": {
		v: 240,
		type : "straight"
	},
	"banana": {
		v: 120,
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
    volume: 0.1
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
  },
  "Zombie":{
    src:"audio/zombie.wav",
    loop: false,
    volume: 0.6
  },
  "Spider":{
    src:"audio/spider.wav",
    loop: false,
    volume: 0.6
  },
  "Skeleton":{
    src:"audio/skeleton.wav",
    loop: false,
    volume: 0.6
  },
  "Snail":{
    src:"audio/snail.wav",
    loop: false,
    volume: 0.6
  },
  "Gorilla":{
    src:'audio/gorilla.wav',
    loop: false,
    volume: 0.6
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
  "banana" : {
		src: "images/banana.png",
    sizeX: 120,
    sizeY: 120,
    numX: 10,
    numY: 8,
    actualSizeX: 200,
    actualSizeY: 200},
	"banana1" : {
		src: "images/banana1.png",
    sizeX: 120,
    sizeY: 120,
    numX: 10,
    numY: 8,
    actualSizeX: 200,
    actualSizeY: 200},
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
	"spell" : {
    src: "images/spell.png",
    sizeX: 60,
    sizeY: 60,
    numX: 10,
    numY: 1,
    actualSizeX: 60,
    actualSizeY: 60},
	"spell1" : {
    src: "images/spell1.png",
    sizeX: 60,
    sizeY: 60,
    numX: 10,
    numY: 1,
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
	//larger number of cloud means the cloud is rendered larger
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
		src: "images/cloud2.png",
		sizeX:400,
		sizeY: 300,
		numX: 1,
		numY: 1,
		actualSizeX: 75,
		actualSizeY: 56,
	},
	"Soldier" : {
		src: "images/monkey.png",
		sizeX: 120,
		sizeY: 120,
		numX: 10,
		numY: 6,
		actualSizeX:70,
		actualSizeY:70,
	},
	"Soldier1" : {
		src: "images/monkey1.png",
		sizeX: 120,
		sizeY: 120,
		numX: 10,
		numY: 6,
		actualSizeX:70,
		actualSizeY:70,
	},
	"SoldierDummy": {
		src: "images/monkeydummy.png",
		sizeX: 120,
		sizeY: 120,
		numX: 1,
		numY: 1,
		actualSizeX:70,
		actualSizeY: 70,
	},
	"SoldierDummy1": {
		src: "images/monkeydummy1.png",
		sizeX: 120,
		sizeY: 120,
		numX: 1,
		numY: 1,
		actualSizeX:70,
		actualSizeY: 70,
	},
  "Skeleton" :{
    src: "images/skeleton.png",
    sizeX: 63,
    sizeY: 93,
    numX: 7,
    numY: 1,
    actualSizeX: 100,
    actualSizeY:150,
  },
  "Snail" :{
    src: "images/snail.png",
    sizeX: 50,
    sizeY: 80,
    numX: 9,
    numY: 1,
    actualSizeX: 100,
    actualSizeY:120,
  },
  "Skeleton1" :{
    src: "images/skeleton1.png",
    sizeX: 63,
    sizeY: 93,
    numX: 7,
    numY: 1,
    actualSizeX:100,
    actualSizeY:150,
  },
  "Snail1" :{
    src: "images/snail1.png",
    sizeX: 50,
    sizeY: 80,
    numX: 9,
    numY: 1,
    actualSizeX: 100,
    actualSizeY:120,
  },
  "Zombie" :{
    src: "images/zombie.png",
    sizeX: 64,
    sizeY: 70,
    numX: 7,
    numY: 1,
    actualSizeX: 100,
    actualSizeY:100,
  },
  "Spider" :{
    src: "images/spider.png",
    sizeX: 35.5,
    sizeY: 50,
    numX: 6,
    numY: 1,
    actualSizeX: 80,
    actualSizeY:80,
  },
  "Zombie1" :{
    src: "images/zombie1.png",
    sizeX: 64,
    sizeY: 70,
    numX: 7,
    numY: 1,
    actualSizeX: 100,
    actualSizeY:100,
  },
  "Spider1" :{
    src: "images/spider1.png",
    sizeX: 35.5,
    sizeY: 50,
    numX: 6,
    numY: 1,
    actualSizeX: 80,
    actualSizeY:80,
  },
  "Gorilla" :{
    src: "images/gorilla.png",
    sizeX: 69,
    sizeY: 70,
    numX: 10,
    numY: 1,
    actualSizeX: 280,
    actualSizeY:280,
  },
  "Gorilla1" :{
    src: "images/gorilla1.png",
    sizeX: 69,
    sizeY: 70,
    numX: 10,
    numY: 1,
    actualSizeX: 280,
    actualSizeY:280,
  }
}
//----------------------------LEVEL DATA-------------------------------------------------------------

levelData = {
	1:{events:[  {time:[1, 5, 10, 10, 12, 15, 15, 20, 15, 25, 30, 35, 35, 35, 40, 45], 
              type:["Cow", "Cow", "Cow", "Cow", "Chicken", "Cow", "Cow", "Cow", "Cow", "Chicken", "Chicken", "Cow", "Cow", "Cow", "Cow", "Chicken"], 
							position:[3, 1, 1, 2, 3, 1, 2, 3, 1,0, 2, 1, 2, 3, 0, 1],
              wait:10},

							{time:[1, 5, 10, 10, 12, 15, 15, 20, 15, 25, 30, 35, 35, 35, 40, 45], 
              type:["Skeleton", "Skeleton", "Skeleton", "Skeleton", "Spider", "Spider", "Skeleton", "Spider", "Skeleton", "Spider", "Spider", "Skeleton", "Skeleton", "Skeleton", "Skeleton", "Spider"], 
              position:[0, 1, 0, 2, 3, 1, 2, 3, 1,0, 2, 1, 2, 3, 0, 1],
              wait:10},

              {time:[1, 5, 10, 10, 12, 15, 15, 20, 15, 25, 30, 35, 35, 35, 40, 45], 
              type:["Zombie", "Zombie", "Zombie", "Zombie", "Snail", "Snail", "Zombie", "Snail", "Zombie", "Snail", "Snail", "Zombie", "Zombie", "Zombie", "Zombie", "Snail"], 
              position:[0, 1, 0, 2, 3, 1, 2, 3, 1,0, 2, 1, 2, 3, 0, 1],
              wait:10},

              {time:[5, 5], 
              type:["Gorilla", "Gorilla"], 
              position:[0, 3],
              wait:10}],
		level: 1,
		deploy: ["Soldier"]},
	2:{}
}
