var fs = require('fs');
var morgan = require('morgan'); // Charge le middleware de logging
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 1848;

var timeline = JSON.parse(fs.readFileSync(__dirname+'/timeline.json'));
//console.log(timeline);

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

app
//.use(morgan('combined')) 
.use(express.static(__dirname+'/src/'));

server.listen(port);

var nodes = []; 
var idSocket = 0;
var currentInterval = null;
var stepId = 0;

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
       io.sockets.emit('initialization');

       clearInterval(currentInterval);
       currentInterval = setInterval(function(){
           var step = {
               id: stepId,
               actions: timeline[stepId]
           };
           io.sockets.emit('step', step);
           stepId++;
           if(stepId >= timeline.length){
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
           if(wasPrimary){
            nodes[0].isPrimary = true;
           }
           io.emit('nodes', nodes);
       }
   });

});



var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address+':'+port);
    } else {
      // this interface has only one ipv4 adress
      console.log('go to http://'+iface.address+':'+port);
    }
    ++alias;
  });
});


