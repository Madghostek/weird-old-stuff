window.onload = function(){
	var socket = io('http://localhost:7777')

	$(document).keypress(function(event){	
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			if($('#promptfield').is(":focus")){
				if($('#title').text()=="Type password"){
					socket.emit('passwd',$('#promptfield').val())
				}
				else{
					socket.emit('new',$('#promptfield').val())
				}
				$('.prompt-modal').hide()
			}
			else{
				sendMessage()
			}
		}	
	});

	$('#btn').click(sendMessage)

	$('#change').click( () => {
		showBox("Change nickname")
	})

	socket.on('connect',() => {
		console.log("connected!")
	})

	socket.on('msg',(a) => {
		$('.chat__wrapper').prepend(a)
	})
	socket.on('disconnect',function(){
			$('body').html("<h1>DISCONNECTED</h1>")
	})

	socket.on('kick',function(a){
		alert("You have been kicked.Reason: "+a)
	})

	socket.on('prompt',function(info){
		showBox(info)
	})

	socket.on('all',function(msg){
		if($('.chat__wrapper').children().lenght == 10){
			$('.chat__wrapper:last-child').remove()
		}
		console.log(msg)
		$('.chat__wrapper').prepend("<font>  "+msg+"</font></br>")
	});
	socket.on('passwd',function(){
		showBox('Type password')

	})
	function sendMessage(){
		data = $('#message').val()
		console.log(data.length)
		if(data.length < 501){
			socket.emit('msg',data)
		}
		$('#message').val("")
		$('#message').focus()
	}
}
function showBox(s){
	$('#title').text(s)
	$('.prompt-modal').show()
}