var prev =[0,0]; //poprzedni punkt sin
var prevd = [0,0]; //poprzedni punkt cos
var i = 1; 
var sc = 100;
var xpos,ypos;
var d; //delta

function setup(){
	createCanvas(innerWidth,innerHeight);
	strokeWeight(4);
	background(51);
	textSize(50)
	xpos = width/6;
	ypos = 3*height/4;
}

function draw(){
	//background(51);
	stroke(200);
	line(xpos, 0, xpos, height);
	line(0, ypos, width, ypos);
	translate(xpos,ypos)
	line(prev[0],sc*prev[1],i,sc*-sin(radians(i)));
	//roznica prev i sin(x)
	stroke(200,50,50);
	d = ((-sin(radians(i)))-prev[1])/radians(1);
	line(prevd[0],sc*prevd[1],i,sc*d)
	prevd=[i,d];
	prev=[i,-sin(radians(i))];
	fill(51)
	stroke(0,0,0);
	rect(80,-400,5000,150)
	fill(255)	
	text("rozniczka:"+d, 100, -300);
	i++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(51);
}