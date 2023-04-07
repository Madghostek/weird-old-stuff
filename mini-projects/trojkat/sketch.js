var pt = [[500,0],[0,500],[500,500]];
var target

function setup(){
	createCanvas(windowWidth,windowHeight);
}

function mousePressed(){
	for (a of pt) {
		if (dist(a[0],a[1],mouseX,mouseY) < 20) {
			target = a
		}
	}
}

function draw(){
	background(51);
	updateVert()
	drawTri()
	drawText();

}

function updateVert(){
	if(mouseIsPressed && target){
		target[0] = mouseX
		target[1] = mouseY
	}
	else {
		target = 0
	}
}

function drawTri(){
	stroke(250)
	strokeWeight(5)
	for(i = 0; i < 3;i++){
		line(pt[i][0],pt[i][1],pt[(i+1)%3][0],pt[(i+1)%3][1])
	}

	var angle = asin(VertDist(0,2) / VertDist(1,2))
	stroke(200)
	fill(0,0,0,0)
	arc(pt[2][0],pt[2][1],50,50,PI,-HALF_PI)
}

function drawText(){
	strokeWeight(0)
	textSize(20)
	fill(255)
	var textPos = createVector((pt[0][0]+pt[1][0])/2,(pt[0][1]+pt[1][1])/2)
	text(VertDist(0,1),textPos.x + 20,textPos.y)
}

function VertDist(a,b){
	return(dist(pt[a][0],pt[a][1],pt[b][0],pt[b][1]))
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}