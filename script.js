var obj;
var obst = [];
var frame = 0;
var highScore = 0;

function startGame() {
	gameCanvas.start();
	obj = new component(30, 30, "yellow", 120, 270);
	document.getElementById("jumpBtn").style.visibility = "visible";
	document.getElementById("startBtn").style.visibility = "hidden";
	document.getElementById("score").style.visibility = "visible";
}

function restartGame() {
	gameCanvas.clear();
	obst = []
	startGame();
	document.getElementById("tryAgain").innerHTML = "";
	document.getElementById("restartBtn").style.visibility = "hidden";
	frame = 0;
	document.getElementById("high").style.visibility = "hidden";
}

var gameCanvas = {
	canvas: document.createElement("canvas"),
	start: function() {
		this.canvas.height = 320;
		this.canvas.width = 720;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(nextFrame, 2.8);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function() {
		clearInterval(this.interval);
		document.getElementById("tryAgain").innerHTML = "Try Again";
		document.getElementById("restartBtn").style.visibility = "visible";
		document.getElementById("jumpBtn").style.visibility = "hidden";
		if (frame > highScore) {
			highScore = frame;
		}
		document.getElementById("high").style.visibility = "visible";
		document.getElementById("high").innerHTML = "High Score: " + highScore;
	}
}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.gravity = 0.3;
    this.gravitySpeed = 0;
	this.update = function() {
		ctx = gameCanvas.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
    	this.gravitySpeed += this.gravity;
    	this.y += this.gravitySpeed;
    	this.outOfBoundsBottom();
    	this.outOfBoundsTop();
	}

	this.crashed = function(obstacle) {
		var objLeft = this.x;
		var objRight = this.x + this.width;
		var objTop = this.y;
		var objBottom = this.y + this.height;
		var obstLeft = obstacle.x;
		var obstRight = obstacle.x + obstacle.width;
		var obstTop = obstacle.y;
		var obstBottom = obstacle.y + obstacle.height;
		var crash = true;
		if ((objBottom < obstTop) || (objLeft > obstRight) || (objRight < obstLeft)) {
			crash = false;
		}
		return crash;
	}
	this.outOfBoundsBottom = function() {
		if (this.y > gameCanvas.canvas.height - this.height-10) {
			this.y = (gameCanvas.canvas.height - this.height-10);
			this.gravitySpeed = 0;
		}
	}
	this.outOfBoundsTop = function() {
		var currGravity = this.gravity;
		if (this.y < 80) {
			this.gravity = 0.1;
		}
	}
}

function nextFrame() {
	var obstX, obstY;
	for (i = 0; i < obst.length; i += 1) {
        if (obj.crashed(obst[i])) {
            gameCanvas.stop();
            return;
        } 
    }
    frame += 1;
    document.getElementById("score").innerHTML = "Score: " + frame;
	gameCanvas.clear();
	var counter = Math.floor(Math.random() * 200);
	if (counter == 0) {
		var obstHeight = Math.floor(Math.random() * (gameCanvas.canvas.height -300)) + 30
		obstX = gameCanvas.canvas.width;
		obstY = gameCanvas.canvas.height - obstHeight;
		obst.push(new component(15, obstHeight, "red", obstX, obstY));
	}
	for (i = 0; i < obst.length; i += 1) {
		obst[i].x += -1;
		obst[i].update();
	}
	obj.newPos();
	obj.update();
}

function jump(x) {
    obj.gravity = x;
}