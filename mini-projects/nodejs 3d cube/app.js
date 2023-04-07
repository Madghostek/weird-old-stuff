var colors = require('colors');
var express = require('express')   //express.js include
var app = express()                //express.js app
var http = require('http').Server(app);
var io = require('socket.io')(http)
var path = require('path')

console.log("Started!".rainbow)
console.log("dirname: "+__dirname+"\\")

app.get('/',function(req,res){
	res.sendFile(__dirname+"/client/index.html")
})

app.use(express.static('client'))

http.listen(7777,function(){
  console.log("Listening on port 7777".green)
})

