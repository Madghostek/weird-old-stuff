function setup(){
	createCanvas(innerWidth,innerHeight);
	fillStyle = "#FFFFFF"
}

var kwadret = {}
var bok = 100
kwadret.x = innerWidth/2-bok/2
kwadret.y = innerHeight*3/4
kwadret.xs = 0
kwadret.ys = 0

function draw(){
	background(51);
	collision()
	update()
	rect(kwadret.x,kwadret.y,bok,bok)
	fill(255)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function collision(){
	if(mouseY < innerHeight*3/4 || mouseY > innerHeight*3/4+bok){return}
	if ( mouseX > kwadret.x && mouseX < kwadret.x+bok/2 ){
		kwadret.xs += mouseX - kwadret.x
	}
	else if(mouseX > kwadret.x + bok/2  && mouseX < kwadret.x+bok){
		kwadret.xs -= kwadret.x+bok - mouseX
	}
}

function update(){
	kwadret.x += kwadret.xs
	kwadret.xs ? kwadret.xs > 0 ? kwadret.xs -= 1 : kwadret.xs += 1 : null

}