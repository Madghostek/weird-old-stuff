var express = require('express');
var app = express();
var colors = require('colors')
var server = require('http').Server(app)
var io = require('socket.io')(server)

server.listen("7777",function(){
	console.log('Listening on port 7777'.green);
})

//express
app.use(express.static('public'))

app.get('/',function(req,res){
	res.sendFile(__dirname+'/public/index.html')
})
//express end

io.on('connect', function(socket){
	socket.on('msg', function(a){
		if(a.length < 500){
			console.log((socket.name ? socket.name : 'Unnamed' )+": "+ a)
			io.emit('msg',"<p><b>"+(socket.name ? socket.name : 'Unnamed' )+"</b>: "+a+"</p>")
		}
		else{
			console.log(socket.name+" did Too long")
		}
	})
})