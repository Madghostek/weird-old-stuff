window.onload = doc
function doc(){
	var socket = io()
	var password
	var btnS=$('#btn-submit').lenght

	$('#input').attr('size', 100);

	$('#btn-submit').click(function(){
		socket.emit('msg', $('#input').val());
		$('#input').val('');
		return false
	})

	socket.on('all',function(msg){
		if($('#Chat').children().lenght == 10){
			$('#Chat:last-child').remove()
		}
		$('#Chat').prepend("<font>  "+msg+"</font></br>")
	});

	$('form').submit(function(){
		socket.emit('msg',$('#input').val());
		$('#input').val('');
		return false
	})
	function nick(socket,info){
		var Nick = prompt(info)
		if(typeof Nick == 'string'){
			if(Nick.indexOf("`")!=-1){
				nick(socket,"Nickname cannot contain '`' character")
			}
			else{
				socket.emit('new',Nick)
				socket.on('passwd',function(){
					password=prompt("Password:")
					socket.emit('passwd',password)
				})
			}		
		}
		else{
			nick(socket,"Nickname cannot be blank")
		}
	}
	socket.on('disconnect',function(){
		alert("Disconnected")
		$('body').html("<h1>DISCONNECTED</h1>")
	})

	socket.on('kick',function(a){
		alert("You have been kicked.Reason: "+a)
	})

	socket.on('doit',function(info){
		nick(socket,info)
	})
}