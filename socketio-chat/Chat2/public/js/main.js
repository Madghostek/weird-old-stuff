var name = 'Unnamed'
var socket = io('http://localhost:7777')
var text = $('#text')
var data

$('#btn').click( () => {
	data = $('#message').val()
	console.log(data.length)
	if(data.length < 501){
		socket.emit('msg',data)
	}
	$('#message').val("")
	$('#message').focus()
})

$('#change').click( () => {

})

socket.on('connect',() => {
	console.log("connected!")
})

socket.on('msg',(a) => {
	text.prepend(a)
})