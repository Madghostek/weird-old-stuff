var x,y
	angle = 0
	s = 0
	a = 0
function setup(){
	createCanvas(innerWidth,innerHeight);
	background(51);
}

function draw(){
	x = cos(radians(angle+180+a))*100
	y = sin(radians(angle+180-a))*100
	strokeWeight(20)
	stroke(255)
	point(110+x,innerHeight/2+y)
	angle+=1
	s++
	a+=60
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}