var express = require('express')
	app = express()
	colors = require('colors')
	http = require('http').createServer(app)
	io = require('socket.io')(http)
	whois=[]
	cmdlist=['help','whois','time','whoami','help2']
	cmdlist1=['kick','com']
	sockets=[]
	index=-1
	why=""
	cmd=[]

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('Local IP: '+add);
})
console.log("Started!".rainbow);

app.get('/',function(req,res){
	res.sendFile(__dirname+"/client/index.html")
});

app.use(express.static('client'))

http.listen(7777,function(){
  console.log("Listening on port 7777".green)
});

io.on('connection', function(socket){
	sockets.push(socket)
	SendPrompt(socket,"Select your nickname")
	socket.on('new',function(n){
		console.log("newe nick")
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
			else{
			if(n=='Admin'){
				socket.emit('passwd')
				socket.on('passwd',function(password){
					if(password!='secret'){
						socket.emit('disconnect')
						socket.disconnect()
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
	socket.on('disconnect',function(){
		console.log(socket.name+" disconected.")
		var index = whois.indexOf(socket.name);
		if(index != -1){
    		whois.splice( index, 1 );
    		sockets.splice(index,1)
		}
	})

	function commandCheck(a,socket){
		cmd=a.split(" ")
		if(cmd[0]=="/whois"){
			socket.emit('all',"Connected users: "+whois.join())
		}
		else if(cmd[0]=="/help"){
			if(cmd[1]=='help'){
				socket.emit('all',"Displays help.")
			}
			else if(cmd[1]=='whois'){
				socket.emit('all',"Displays connected users.")
			}
			else if(cmd[1]=='time'){
				socket.emit('all',"Displays current time.")
			}
			else if(cmd[1]=='whoami'){
				socket.emit('all',"Displays your nickname and client id.")
			}
			else if(cmd[1]=='help2'){
				socket.emit('all',"Not for normal users,displays secret commands.")
			}
			else if( typeof cmd[1]=='undefined' || cmd[1]==''){
			socket.emit('all',"Command list: "+cmdlist.join())
			}
			else{
			socket.emit('all',"This command does not exist: "+cmd[1])
			}
		}
		else if(cmd[0]=="/time"){
			socket.emit('all',Date())
		}
		else if(cmd[0]=="/help2"){
			if(socket.name=='Admin'){
				socket.emit('all',"Special command list: "+cmdlist1.join())
		}
			else{
				socket.emit('all',"You don't have premission to use this command.")
				console.log(socket.name+" tried to use: /"+cmd[0])
			}
		}
		else if(cmd[0]=='/whoami'){
			socket.emit('all','Nick: '+socket.name+' Id: '+socket.id)
		}
		else if(socket.name=='Admin'){
			Admin(cmd)
		}
		else{
			socket.emit('all',"Invalid command.")
		}
	}
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
	function kick(uname,why,silent){   //uname is /kick 'uname'
		if(typeof uname != 'undefined' && uname!=''){
			if(whois.indexOf(uname.replace(/`/g, " ")) !=-1){
				for (var i = sockets.length - 1; i > -1; i--) {
    				if (sockets[i].name === uname){
    					index = i
    					console.log("FOUND INDEX "+index)
        			}
        		}
        	if(why!=undefined){
        		sockets[index].emit('kick',why.replace("`"," "))
        		sockets[index].disconnect()
        		if(silent!='-s'){
					io.emit("all","Admin kicked "+uname.replace(/`/g, " "))
				}
        	}
        	else{
        		why='none'
        		sockets[index].emit('kick',why.replace("`"," "))
        		sockets[index].disconnect()
        		if(silent!='-s'){
					io.emit("all","Admin kicked "+uname.replace(/`/g, " "))
				}
        	}
			}
			else{
			socket.emit("all","Invaild username")
		}
		}
		else{
			socket.emit("all","Specify username!")
		}		
	}

	function Admin(){
		if(cmd[0]=='/kick'){
			kick(cmd[1],cmd[2],cmd[3])
		}
		else if(cmd[0]=='/com'){
			eval(cmd[1])
		}
		else{
			socket.emit('all',"Invaild command "+cmd[0])
		}
	}

	function SendPrompt(socket,info){
		socket.emit('prompt',info)
	}

});