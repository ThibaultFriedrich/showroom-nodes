var fs = require('fs');
var morgan = require('morgan'); // Charge le middleware de logging
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

app
//.use(morgan('combined')) 
.use(express.static('src/'));

server.listen(1848);

var nodes = []; 
var idSocket = 0;
var currentInterval = null;
var stepId = 0;
var stepIdMax = 1;

function findNodeId(){
    return idSocket++;
}

io.on('connection', function (socket) {

   var node = {
       id: 'node'+findNodeId()
   };

   if(nodes.length == 0){
       node.isPrimary = true;
   } else {
       node.isPrimary = false;
   }

   nodes.push(node);

   socket.emit('current-node-id', node.id); 

   io.sockets.emit('nodes', nodes);

   socket.on('nodes', function(nodesV){
       nodes = nodesV;
       socket.broadcast.emit('nodes', nodes);
   });

   socket.on('play', function(){

       clearInterval(currentInterval);
       currentInterval = setInterval(function(){
           io.sockets.emit('step', stepId++);
           if(stepId > stepIdMax){
            stepId = 0;
           }
       }, 2000);
   });

   socket.on('stop', function(){
    clearInterval(currentInterval);
   });


   socket.on('disconnect', function(){
       var index = nodes.indexOf(node);
       var wasPrimary = node.isPrimary;
       nodes.splice(index, 1);
       if(nodes.length > 0){
           nodes[0].isPrimary = true;
           io.emit('nodes', nodes);
       }
   });

});



