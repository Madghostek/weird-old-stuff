var RDots = []
function setup(){
	createCanvas(640,360);
	Veh1 = new Veh(width/2, height/2);

	for(i = 0;i < 10;i++){
		RDots[i] = new Dot(random(width),random(height))
	}
}
function draw(){
	background(51);
	var mouse = createVector(mouseX,mouseY)
	Veh1.seek(mouse)
	Veh1.update();

	Veh1.display();
	for(i = 0;i < RDots.length;i++){
		RDots[i].display()
	}
}

function Dot(x,y){
	this.position = createVector(x,y)
	this.display = function(){
		fill('red')
		stroke('#FF7777')
		noStroke()
		ellipse(this.position.x,this.position.y,10,10)
	}
}

function Veh(x,y){
	this.position = createVector(x,y)
	this.velocity = createVector(0,0)
	this.acceleration = createVector(0,0)
	this.maxspd = 5
	this.maxforce = 0.2
	this.size = 7
	this.radius = 30
	this.maxPoisonForce = random(30)
	this.poisonPersp = random(80)

	this.update = function(){

		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxspd)
		this.position.add(this.velocity);
		this.acceleration.mult(0)
	}

	this.addForce = function(force){
		this.acceleration.add(force)
	}
	this.display = function(){
		var angle = this.velocity.heading()
    	push()
		translate(this.position.x,this.position.y)
		rotate(angle+PI/2)
		fill(51);
    	stroke('red');
		ellipse(0,0,this.poisonPersp*2,this.poisonPersp*2)
		line(0,0,0,this.maxPoisonForce*5)
		fill(127);
    	stroke(200);
		beginShape();
   		vertex(0, -this.size*2);
   		vertex(-this.size, this.size*2);
    	vertex(this.size, this.size*2);
    	endShape(CLOSE);
    	pop()
	}
	this.seek = function(target){
		var desired = p5.Vector.sub(target,this.position)
		desired.setMag(this.maxspd)
		var aDesired = []
		for(i = 0;i < RDots.length;i++){
			aDesired[i] = p5.Vector.sub(this.position,RDots[i].position,)
			if(aDesired[i].mag() > this.poisonPersp){
			aDesired[i].mult(0)
			}
			aDesired[i].setMag(this.maxPoisonForce)
			desired.add(aDesired[i])
		}

		var steer = p5.Vector.sub(desired,this.velocity)
		steer.limit(this.maxforce)
		this.addForce(steer)
	}
}