var express = require('express');
	app = express();
	colors = require('colors')
	server = require('http').Server(app)
	io = require('socket.io')(server)

var whois = []
	cmdlist=['help','whois','time','whoami','help2']
	cmdlist1=['kick','com']
//setup
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('Local IP: '+add);
})
server.listen("7777",function(){
	console.log('Listening on port 7777'.green);
})
//setup end
//express
app.use(express.static('public'))

app.get('/',function(req,res){
	res.sendFile(__dirname+'/public/index.html')
})
//express end

io.on('connect', function(socket){
	SendPrompt(socket,"Select your nickname")
	socket.on('new',function(n){
		console.log("new nick"+n)
		if(whois.indexOf(n)==-1){
			if(n==''||n=='undefined'){
				SendPrompt(socket,"Type in something...")
			}
			else if(n==null){
				socket.disconnect()
			}
			else if(n.indexOf('`')!=-1){
				console.log("Disconnected somebody for ` character")
				socket.emit('disconnect')
				socket.disconnect()
			}
			else if(n=='Admin'){
				socket.emit('passwd')
				socket.on('passwd',function(password){
					if(password!='secret'){
						disconnect()
					}
					else{
						login(n)
					}
				})			
			}
			else{
				login(n)
			}
		}
		else{
			SendPrompt(socket,'Nickname already in use')
		}
	})
	socket.on('msg',function(a){
		console.log(socket.name+":"+a)
		if(a.charAt(0)!='/'){
			if(socket.name=='Admin'){
				io.emit('all',"<b id='superuser'>"+socket.name+"</b>:"+a)
			}
			else{
				io.emit('all',"<b>"+socket.name+"</b>:"+a)
			}
		}
		else{
			commandCheck(a,socket)
		}
	})
	socket.on('disconnect',disconnect)
	function login(n){
		if(n=='Admin'){
			console.log(n+" connected!".yellow)
		}
		else{
			console.log(n+" connected!")
		}
				whois.push(n)
				socket.name = n
				socket.emit('all','<b>Welecome on socket.io chat server! type in /help for commands<b>')
	}
	function SendPrompt(socket,info){
		socket.emit('prompt',info)
	}
	function disconnect(){
		console.log(socket.name+"("+whois.indexOf(socket.name)+") left")
		whois.splice(whois.indexOf(socket.name),1)
		socket.disconnect()
	}
})