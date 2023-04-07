const c = document.getElementById('canvas')
const ctx = c.getContext('2d')
var h,MouseX,MouseY
var balls = []

main()

function main(){
	c.width = window.innerWidth
	c.height = window.innerHeight


	for(x=0;x<5;x++){
		balls[x] = new Ball()
	}

	setInterval(function(){
		c.width = window.innerWidth
		c.height = window.innerHeight
		balls.forEach(function(a){a.follow();a.update();a.collision();a.draw()})
	},15)
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


document.addEventListener("mousedown",function(e){
	h = true
})


document.addEventListener("mouseup",function(e){
	h = false
})

document.addEventListener("wheel",function(){spawn()})

document.addEventListener("mousemove",function(f){
	MouseX = f.clientX
	MouseY = f.clientY
})

function spawn(){
	balls.push(new Ball())
}