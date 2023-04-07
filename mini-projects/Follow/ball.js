class Ball{
	constructor()
	{
		this.x = Math.random()*c.width
		this.y = Math.random()*c.height
		this.Sx = this.Sy = Math.round(Math.random())
		this.Spd = Math.random()*10
		this.size = Math.random()*50
		this.color = getRandomColor()
	}

	update(){
		if (!this.Sx){
			this.x = this.x+this.Spd
		}
		else{
			this.x = this.x-this.Spd
		}
		if (!this.Sy){
			this.y = this.y+this.Spd
		}
		else{
			this.y = this.y-this.Spd
		}
	}

	follow(){	
		if ((this.x > MouseX && !this.Sx && h) || (this.x < MouseX && this.Sx && h)){
			this.cd(1)
		}
		if((this.y > MouseY && !this.Sy && h) || (this.y < MouseY && this.Sy && h)){
			this.cd()
		}
	}
	collision(){
		if(this.x-this.size <= 0){
			this.cd(1)
			this.x+=this.size - this.x
		}
		else if (this.x+this.size >= c.width){
			this.cd(1)
			this.x-=this.size - (c.width-this.x)
		}
		if(this.y-this.size <= 0){
			this.cd()
			this.y+=this.size - this.y
		}
		else if(this.y+this.size >= c.height){
			this.cd()
			this.y-=this.size - (c.height-this.y)
		}
	}

	draw(){
		ctx.fillStyle = this.color
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.size,0,3*Math.PI)
		ctx.fill()
	}

	cd(dir){
		this.color = getRandomColor()	
		if(dir){
			this.Sx = 1-this.Sx
		}
		else{
			this.Sy = 1-this.Sy
		}
	}	


}